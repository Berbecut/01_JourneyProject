using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_v02.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string LicensePlate { get; set; }
        public Boolean Active { get; set; }

        public Company Company { get; set; }

        public List<Journey> Journeys { get; set; }

    }
}
