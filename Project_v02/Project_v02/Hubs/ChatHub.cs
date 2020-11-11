using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_v02.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string name, string message, string time)
        {

            if (name == "Linus")
            {
                name = "Helpdesk:";
            }

            await Clients.All.SendAsync("ReceiveMessage", name, message, time);
        }
    }
}
