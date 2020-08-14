/**
 * @File   : HeartBeatHandler.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/26 0:00:00PM
 */
using UniWebServer;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System;

namespace SeinJS
{
    public class HeartBeatHandler : IWebResource
    {
        public bool needUpdate = false;
        public bool isAlive = false;

        private Timer _timer;

        public void HandleRequest(Request request, Response response)
        {
            if (_timer != null)
            {
                _timer.Change(4000, 0);
            }

            isAlive = true;
            response.statusCode = 200;
            response.message = "OK";
            response.headers.Add("Content-Type", "application/json");

            response.Write("{\"update\": " + (needUpdate ? "true" : "false") + "}");

            if (needUpdate)
            {
                needUpdate = false;
            }

            if (_timer == null)
            {
                _timer = new Timer(OnTimedEvent);
                _timer.Change(4000, 0);
            }
        }

        private void OnTimedEvent(object state)
        {
            isAlive = false;
        }
    }
}
