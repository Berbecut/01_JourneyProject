using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Project_v02.Models;

namespace Project_v02.Areas.Identity.Data
{
    // Add profile data for application users by adding properties to the User class
    public class User : IdentityUser
    {
        public Company company { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
      //  public ICollection<Journey> UserJourneys { get; set; }
    }
}
