#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using SimpleJSON;
using System.Runtime.Serialization.Formatters.Binary;
using System;
using UnityEditor.SceneManagement;

public enum ExporterState
{
	IDLE,
	REQUEST_CODE,
	PUBLISH_MODEL,
	GET_CATEGORIES,
	USER_ACCOUNT_TYPE,
	CHECK_VERSION
}


public class Exporter : EditorWindow {

    [MenuItem("Tools/Export to GlTF")]
	static void Init()
	{
#if UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX // edit: added Platform Dependent Compilation - win or osx standalone
		Exporter window = (Exporter)EditorWindow.GetWindow(typeof(Exporter));
		window.titleContent.text = "Export to GlTF";
		window.Show();
#else // and error dialog if not standalone
		EditorUtility.DisplayDialog("Error", "Your build target must be set to standalone", "Okay");
#endif
	}

	// Static data
	public static string skfbUrl = "https://sketchfab.com/";
	public static string latestReleaseUrl = "https://github.com/sketchfab/Unity-glTF-Exporter/releases";
	public static string resetPasswordUrl = "https://sketchfab.com/login/reset-password";
	public static string createAccountUrl = "https://sketchfab.com/signup";
	public static string reportAnIssueUrl = "https://help.sketchfab.com/hc/en-us/requests/new?type=exporters&subject=Unity+Exporter";
	public static string privateUrl = "https://help.sketchfab.com/hc/en-us/articles/115000422206-Private-Models";
	public static string draftUrl = "https://help.sketchfab.com/hc/en-us/articles/115000472906-Draft-Mode";
    public static int opt_maxSize = 1024;
    public static bool opt_halfSpotAngle = true;
    public static bool opt_quadraticAttenuation = true;
    public static int opt_jpgQuality= 85;
    public static bool opt_noLighting= false;

    // UI dimensions (to be cleaned)
    [SerializeField]
	Vector2 loginSize = new Vector2(603, 190);
	[SerializeField]
	Vector2 fullSize = new Vector2(603, 340);
	[SerializeField]
	Vector2 descSize = new Vector2(603, 175);

	// Fields limits
	const int NAME_LIMIT = 48;
	const int DESC_LIMIT = 1024;
	const int TAGS_LIMIT = 50;
	const int PASSWORD_LIMIT = 64;
	const int SPACE_SIZE = 5;

	private string exporterVersion = GlTF_Writer.exporterVersion;
	private string latestVersion = "0.0.1";

	// Keys used to save credentials in editor prefs
	const string usernameEditorKey = "UnityExporter_username";
	//const string passwordEditorKey = "UnityExporter_password";

	// Exporter UI: static elements
	[SerializeField]
	GUIStyle exporterTextArea;
	GUIStyle exporterLabel;
	GUIStyle exporterClickableLabel;
	private string clickableLabelColor = "navy";
	//private Color clickableLabelColor =
	// Exporter objects and scripts
	WWW www;
	string access_token = "";
	ExporterState state;
	GameObject exporterGo;
	ExporterScript publisher;
	SceneToGlTFWiz exporter;
	private string exportPath;
	private string zipPath;

	////Account settings


	//Fields
	private string user_name = "";
	private string user_password = "";

	private bool opt_exportAnimation = true;
    //private bool opt_quadraticAttenuation = true;
    private string param_name = "";
	private string param_description = "";
	private string param_tags = "";
	private bool param_autopublish = true;
	private bool param_private = false;
	private string param_password = "";

	// Exporter UI: dynamic elements
	private string status = "";
	private Color blueColor = new Color(69 / 255.0f, 185 / 255.0f, 223 / 255.0f);
	private Color redColor = new Color(0.8f, 0.0f, 0.0f);
	private Color greyColor = Color.white;
	private bool isUserPro = false;
	private string userDisplayName = "";
	Dictionary<string, string> categories = new Dictionary<string, string>();
	List<string> categoriesNames = new List<string>();
	//int categoryIndex = 0;
	Rect windowRect;

	// Oauth stuff
	private float expiresIn = 0;
	private int lastTokenTime = 0;

	//private List<String> tagList;
	void Awake()
	{
		zipPath = Application.temporaryCachePath + "/" + "scene.zip";
        exportPath = Application.temporaryCachePath + "/" + "scene.gltf";

		exporterGo = new GameObject("Exporter");
		publisher = exporterGo.AddComponent<ExporterScript>();
		exporter = exporterGo.AddComponent<SceneToGlTFWiz>();
		//FIXME: Make sure that object is deleted;
		exporterGo.hideFlags = HideFlags.HideAndDontSave;
		//publisher.getCategories();
		resizeWindow(loginSize);
		publisher.checkVersion();
	}

	void OnEnable()
	{
		// Pre-fill model name with scene name if empty
		if (param_name.Length == 0)
		{
			param_name = EditorSceneManager.GetActiveScene().name;
		}
		resizeWindow(loginSize);
		relog();
	}

	int convertToSeconds(DateTime time)
	{
		return (int)(time.Hour * 3600 + time.Minute * 60 + time.Second);
	}

	void OnSelectionChange()
	{
		// do nothing for now
	}

	void resizeWindow(Vector2 size)
	{
		//this.maxSize = size;
		this.minSize = size;
	}

	void relog()
	{
		if(publisher && publisher.getState() == ExporterState.REQUEST_CODE)
		{
			return;
		}
		if (user_name.Length == 0)
		{
			user_name = EditorPrefs.GetString(usernameEditorKey);
			//user_password = EditorPrefs.GetString(passwordEditorKey);
		}

		if (publisher && user_name.Length > 0 && user_password.Length > 0)
		{
			publisher.oauth(user_name, user_password);
		}
	}

	void expandWindow(bool expand)
	{
		windowRect = this.position;
		windowRect.height = expand ? fullSize.y : loginSize.y;
		position = windowRect;
	}

	// Update is called once per frame
	void OnInspectorUpdate()
	{
		Repaint();
		float currentTimeSecond = convertToSeconds(DateTime.Now);
		if (access_token.Length > 0 && currentTimeSecond - lastTokenTime > expiresIn)
		{
			access_token = "";
			relog();
		}

		if (publisher != null && publisher.www != null && publisher.www.isDone)
		{
			state = publisher.getState();
			www = publisher.www;
			switch (state)
			{
				case ExporterState.CHECK_VERSION:
					//JSONNode githubResponse = JSON.Parse(this.jsonify(www.text));
					//if(githubResponse != null && githubResponse[0]["tag_name"] != null)
					//{
					//	latestVersion = githubResponse[0]["tag_name"];
					//	if (exporterVersion != latestVersion)
					//	{
					//		bool update = EditorUtility.DisplayDialog("Exporter update", "A new version is available \n(you have version " + exporterVersion + ")\nIt's strongly rsecommended that you update now. The latest version may include important bug fixes and improvements", "Update", "Skip");
					//		if (update)
					//		{
					//			Application.OpenURL(latestReleaseUrl);
					//		}
					//	}
					//	else
					//	{
					//		resizeWindow(fullSize);
					//	}
					//}
					//else
					//{
					//	latestVersion = "";
					//	resizeWindow(fullSize + new Vector2(0, 15));
					//}
					publisher.setIdle();
					break;
				case ExporterState.REQUEST_CODE:
					JSONNode accessResponse = JSON.Parse(this.jsonify(www.text));
                    accessResponse["access_token"] = "2333";
                    if (exporterVersion != latestVersion)
                        resizeWindow(fullSize + new Vector2(0, 20));
                    else
                        resizeWindow(fullSize);
					break;
				case ExporterState.PUBLISH_MODEL:

					if (www.responseHeaders["STATUS"].Contains("201") == true)
					{
						string urlid = www.responseHeaders["LOCATION"].Split('/')[www.responseHeaders["LOCATION"].Split('/').Length -1];
						string url = skfbUrl + "models/" + urlid;
						Application.OpenURL(url);
					}
					else
					{
						EditorUtility.DisplayDialog("Upload failed", www.responseHeaders["STATUS"], "Ok");
					}
					publisher.setIdle();
					break;
				case ExporterState.GET_CATEGORIES:
					string jsonify = this.jsonify(www.text);
					if (!jsonify.Contains("results"))
					{
						Debug.Log(jsonify);
						Debug.Log("Failed to retrieve categories");
						publisher.setIdle();
						break;
					}

					JSONArray categoriesArray = JSON.Parse(jsonify)["results"].AsArray;
					foreach (JSONNode node in categoriesArray)
					{
						categories.Add(node["name"], node["slug"]);
						categoriesNames.Add(node["name"]);
					}
					publisher.setIdle();
					break;

				case ExporterState.USER_ACCOUNT_TYPE:
					string accountRequest = this.jsonify(www.text);
					if(!accountRequest.Contains("account"))
					{
						Debug.Log(accountRequest);
						Debug.Log("Failed to retrieve user account type");
						publisher.setIdle();
						break;
					}

					var userSettings = JSON.Parse(accountRequest);
					isUserPro = userSettings["account"].ToString().Contains("free") == false;
					userDisplayName = userSettings["displayName"];
					publisher.setIdle();
					break;
			}
		}
	}

	private string jsonify(string jsondata)
	{
		return jsondata.Replace("null", "\"null\"");
	}

	public float progress()
	{
		if (www == null)
			return 0.0f;

		return 0.99f * www.uploadProgress + 0.01f * www.progress;
	}

	private bool updateExporterStatus()
	{
		status = "";

		if (param_name.Length > NAME_LIMIT)
		{
			status = "Model name is too long";
			return false;
		}


		if (param_name.Length == 0)
		{
			status = "Please give a name to your model";
			return false;
		}


		if (param_description.Length > DESC_LIMIT)
		{
			status = "Model description is too long";
			return false;
		}


		if (param_tags.Length > TAGS_LIMIT)
		{
			status = "Model tags are too long";
			return false;
		}


		int nbSelectedObjects = Selection.GetTransforms(SelectionMode.Deep).Length;
		if (nbSelectedObjects == 0)
		{
			status = "No object selected to export";
			return false;
		}

		status = "Upload " + nbSelectedObjects + " object" + (nbSelectedObjects != 1 ? "s" : "");
		return true;
	}

	void OnGUI()
	{
		if(exporterLabel == null)
		{
			exporterLabel = new GUIStyle(GUI.skin.label);
			exporterLabel.richText = true;
		}

		if(exporterTextArea == null)
		{
			exporterTextArea = new GUIStyle(GUI.skin.textArea);
			exporterTextArea.fixedWidth = descSize.x;
			exporterTextArea.fixedHeight = descSize.y;
		}

		if(exporterClickableLabel == null)
		{
			exporterClickableLabel = new GUIStyle(EditorStyles.centeredGreyMiniLabel);
			exporterClickableLabel.richText = true;
		}

		GUILayout.Space(SPACE_SIZE);

		// Model settings
		GUILayout.Label("Model properties", EditorStyles.boldLabel);

		// Model name
		GUILayout.Label("Name");
		param_name = EditorGUILayout.TextField(param_name);
		GUILayout.Space(SPACE_SIZE);

        GUILayout.Label("Texture properties", EditorStyles.boldLabel);

        GUILayout.Label("Texture max size");
        Exporter.opt_maxSize = EditorGUILayout.IntField(Exporter.opt_maxSize);
        GUILayout.Label("Texture jpg quality");
        Exporter.opt_jpgQuality = EditorGUILayout.IntField(Exporter.opt_jpgQuality);
        GUILayout.Space(SPACE_SIZE);

        GUILayout.Label("Options", EditorStyles.boldLabel);

        EditorGUIUtility.labelWidth = 200;

        opt_exportAnimation = EditorGUILayout.Toggle("Export animation", opt_exportAnimation);
        opt_halfSpotAngle = EditorGUILayout.Toggle("Half spot angle(Hilo3d, Threejs...)", Exporter.opt_halfSpotAngle);
        opt_quadraticAttenuation = EditorGUILayout.Toggle("Light quadratic attenuation(Hilo3d...)", Exporter.opt_quadraticAttenuation);

        GUILayout.Label("Materials", EditorStyles.boldLabel);
        opt_noLighting = EditorGUILayout.Toggle("No Lighting(Always for mobile)", Exporter.opt_noLighting);

        //GUILayout.Space(SPACE_SIZE);

        //if (categories.Count > 0)
        //	categoryIndex = EditorGUILayout.Popup(categoryIndex, categoriesNames.ToArray());

        //GUILayout.Space(SPACE_SIZE);
        bool enable = updateExporterStatus();

		if (enable)
			GUI.color = blueColor;
		else
			GUI.color = greyColor;

		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		if (GUILayout.Button ("Save", GUILayout.Width(250), GUILayout.Height(40))) {
			if (System.IO.File.Exists(zipPath))
			{
				System.IO.File.Delete(zipPath);
			}
            zipPath = Application.temporaryCachePath + "/" + param_name + ".zip";
            exportPath = Application.temporaryCachePath + "/" + param_name + ".gltf";
			exporter.ExportCoroutine(exportPath, null, false, true, opt_exportAnimation, true);
			OpenInFileBrowser.Open (Path.GetDirectoryName(exportPath));
		}
	}

	private Dictionary<string, string> buildParameterDict()
	{
		Dictionary<string, string> parameters = new Dictionary<string, string>();
		parameters["name"] = param_name;
		parameters["description"] = param_description;
		parameters["tags"] = "unity unity3D " + param_tags;
		parameters["private"] = param_private ? "1" : "0";
		parameters["isPublished"] = param_autopublish ? "1" : "0";
		if (param_private)
			parameters["password"] = param_password;

		return parameters;
	}

	void OnDestroy()
	{
		if (System.IO.File.Exists(zipPath))
			System.IO.File.Delete(zipPath);

		if (exporterGo)
		{
			DestroyImmediate(exporterGo);
			exporter = null;
			publisher = null;
		}
	}
}

public class ExporterScript : MonoBehaviour
{
	bool done = false;
	ExporterState state;
	public WWW www;
	public string localFileName = "";
	private string skfbUrl = "https://sketchfab.com/";
	private string latestVersionCheckUrl = "https://api.github.com/repos/sketchfab/Unity-glTF-Exporter/releases";

	public void Start()
	{
		state = ExporterState.IDLE;
		done = false;
	}

	public bool isDone()
	{
		return done;
	}
	public void checkVersion()
	{
		StartCoroutine(checkVersionCoroutine());
	}

	public void oauth(string user_name, string user_password)
	{
		StartCoroutine(oauthCoroutine(user_name, user_password));
	}

	public void publish(Dictionary<string, string> para, string accessToken)
	{
		StartCoroutine(publishCoroutine(para, accessToken));
	}

	public void setState(ExporterState newState)
	{
		this.state = newState;
	}

	public ExporterState getState()
	{
		return state;
	}

	public void setIdle()
	{
		state = ExporterState.IDLE;
	}
	public void setFilePath(string exportFilepath)
	{
		localFileName = exportFilepath;
	}

	public void getCategories()
	{
		StartCoroutine(categoriesCoroutine());
	}

	public void getAccountType(string access_token)
	{
		StartCoroutine(userAccountCoroutine(access_token));
	}

	private IEnumerator categoriesCoroutine()
	{
		state = ExporterState.GET_CATEGORIES;
		www = new WWW(skfbUrl + "v3/categories");
		yield return www;
	}

	string dummyClientId = "IUO8d5VVOIUCzWQArQ3VuXfbwx5QekZfLeDlpOmW";

	// Request access_token
	private IEnumerator oauthCoroutine(string user_name, string user_password)
	{
		done = false;
		state = ExporterState.REQUEST_CODE;
		WWWForm oform = new WWWForm();
		oform.AddField("username", user_name);
		oform.AddField("password", user_password);
		www = new WWW(skfbUrl + "oauth2/token/?grant_type=password&client_id=" + dummyClientId, oform);
		yield return www;
	}

	private IEnumerator checkVersionCoroutine()
	{
		state = ExporterState.CHECK_VERSION;
		www = new WWW(latestVersionCheckUrl);
		yield return www;
	}

	private IEnumerator userAccountCoroutine(string access_token)
	{
		done = false;
		state = ExporterState.USER_ACCOUNT_TYPE;
		WWWForm oform = new WWWForm();
		Dictionary<string, string> headers = oform.headers;
		headers["Authorization"] = "Bearer " + access_token;
		www = new WWW(skfbUrl + "v3/me", null, headers);
		yield return www;
	}

	// Publish file to Sketchfab
	private IEnumerator publishCoroutine(Dictionary<string, string> parameters, string accessToken)
	{
		state = ExporterState.PUBLISH_MODEL;
		done = false;
		WWWForm postForm = new WWWForm();
		if (!System.IO.File.Exists(localFileName))
		{
			Debug.LogError("File has not been exported. Aborting publish.");
		}

		// Export
		byte[] data = File.ReadAllBytes(localFileName);
		postForm.AddBinaryData("modelFile", data, localFileName, "application/zip");
		foreach (string param in parameters.Keys)
		{
			postForm.AddField(param, parameters[param]);
		}

		postForm.AddField("source", "Unity-exporter");
		//postForm.AddField("isPublished", true ? "1" : "0");
		//postForm.AddField("private", true ? "1" : "0");

		Dictionary<string, string> headers = postForm.headers;
		headers["Authorization"] = "Bearer " + accessToken;
		www = new WWW(skfbUrl + "v3/models", postForm.data, headers);
		yield return www;
	}
}
#endif