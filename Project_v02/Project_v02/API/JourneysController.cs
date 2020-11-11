using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_v02.Models;
using Microsoft.AspNetCore.Authorization;

namespace Project_v02.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class JourneysController : ControllerBase
    {
        private readonly myDBContext _context;

        public JourneysController(myDBContext context)
        {
            _context = context;
        }

        // GET: api/Journeys
        [HttpGet]
        [Authorize] // link to getJourneysController.js row 7
        public async Task<ActionResult<IEnumerable<Journey>>> GetJourneys()
        {
            return await _context.Journeys
                .Include(x => x.Vehicle)
                .Include(x => x.LocationStart)
                .Include(x => x.LocationStop)
                .ToListAsync();
        }

        // GET: api/Journeys
        [HttpGet]
        [Route("/api/partialJourneys")]
        public async Task<ActionResult<IEnumerable<Journey>>> GetpartialJourneys() // see get("/api/partialJourneys") from userConnectedController.js
        {
            return await _context.Journeys
                .Include(x => x.Vehicle)
                .Include(x => x.LocationStart)
                .Include(x => x.LocationStop)
                .Where(x => x.MeterStop == 0) // I included this, because it makes reference to situation when we save partial journey
                .ToListAsync();
        }


        // GET: api/Journeys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Journey>> GetJourney(int id)
        {
            var journey = await _context.Journeys
                .Include(x => x.Vehicle)
                .Include(x => x.LocationStart)
                .Include(x => x.LocationStop)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (journey == null)
            {
                return NotFound();
            }

            return journey;
        }

        // PUT: api/Journeys/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJourney(int id, postJourney postJourney)
        {


            var journey = await _context.Journeys.FirstOrDefaultAsync(x => x.Id == id);

            journey.MeterStart = postJourney.MeterStart;
            journey.DateTime = postJourney.DateTime.AddHours(2); //Added 2 hours to reflect reality
            journey.MeterStop = postJourney.MeterStop;
            journey.TotalLength = postJourney.TotalLength;


            journey.Case = postJourney.Case;
            journey.Note = postJourney.Note;


            Vehicle vehicle = _context.Vehicles.Where(x => x.LicensePlate == postJourney.LicensePlate).First();
            journey.Vehicle = vehicle;

            Location LocationStart = _context.Locations
                .Where(x => x.City == postJourney.CityStart)
                .Where(x => x.StreetName == postJourney.StartAddress)
                .Where(x => x.StreetNumber == postJourney.StartNo)
                .FirstOrDefault();


            if (LocationStart == null)
            {
                LocationStart = new Location();
                LocationStart.City = postJourney.CityStart;
                LocationStart.LatitudeEnd = 1;
                LocationStart.LongitudeEnd = 1;
                LocationStart.LongitudeStart = 1;
                LocationStart.LatitudeStart = 1;
                LocationStart.StreetName = postJourney.StartAddress;
                LocationStart.StreetNumber = postJourney.StartNo;

                _context.Locations.Add(LocationStart);
            }


            journey.LocationStart = LocationStart;

            Location LocationStop = _context.Locations
            .Where(x => x.City == postJourney.CityStop)
            .Where(x => x.StreetName == postJourney.EndAddress)
            .Where(x => x.StreetNumber == postJourney.EndNo)
            .FirstOrDefault();

            if (LocationStop == null)
            {
                LocationStop = new Location();
                LocationStop.City = postJourney.CityStop;
                LocationStop.LatitudeEnd = 1;
                LocationStop.LongitudeEnd = 1;
                LocationStop.LongitudeStart = 1;
                LocationStop.LatitudeStart = 1;
                LocationStop.StreetName = postJourney.EndAddress;
                LocationStop.StreetNumber = postJourney.EndNo;

                _context.Locations.Add(LocationStop);

            }
            journey.LocationStop = LocationStop;




            _context.Entry(journey).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JourneyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Journeys
        [HttpPost]
        public async Task<ActionResult<Journey>> PostJourney(postJourney postJourney)
        {
            //inserted by Florin in order to save the data for a new journey
            Journey journey = new Journey();
            journey.MeterStart = postJourney.MeterStart;
            journey.DateTime = postJourney.DateTime.AddHours(2); //Added 2 hours to reflect reality
            journey.MeterStop = postJourney.MeterStop;
            journey.TotalLength = postJourney.TotalLength;


            journey.Case = postJourney.Case;
            journey.Note = postJourney.Note;


            Vehicle vehicle = _context.Vehicles.Where(x => x.LicensePlate == postJourney.LicensePlate).First();
            journey.Vehicle = vehicle;

            // create object LocationStart
            Location LocationStart = _context.Locations
                .Where(x => x.City == postJourney.CityStart)
                .Where(x => x.StreetName == postJourney.StartAddress)
                .Where(x => x.StreetNumber == postJourney.StartNo)
                .FirstOrDefault();


            if (LocationStart == null)
            {
                LocationStart = new Location();
                LocationStart.City = postJourney.CityStart;
                LocationStart.LatitudeEnd = 1;
                LocationStart.LongitudeEnd = 1;
                LocationStart.LongitudeStart = 1;
                LocationStart.LatitudeStart = 1;
                LocationStart.StreetName = postJourney.StartAddress;
                LocationStart.StreetNumber = postJourney.StartNo;

                _context.Locations.Add(LocationStart);
            }

            journey.LocationStart = LocationStart;


            // create object LocationStop
            Location LocationStop = _context.Locations
            .Where(x => x.City == postJourney.CityStop)
            .Where(x => x.StreetName == postJourney.EndAddress)
            .Where(x => x.StreetNumber == postJourney.EndNo)
            .FirstOrDefault();

            if (LocationStop == null)
            {
                LocationStop = new Location();
                LocationStop.City = postJourney.CityStop;
                LocationStop.LatitudeEnd = 1;
                LocationStop.LongitudeEnd = 1;
                LocationStop.LongitudeStart = 1;
                LocationStop.LatitudeStart = 1;
                LocationStop.StreetName = postJourney.EndAddress;
                LocationStop.StreetNumber = postJourney.EndNo;

                _context.Locations.Add(LocationStop);

            }
            journey.LocationStop = LocationStop;



            _context.Journeys.Add(journey);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJourney", new { id = journey.Id }, journey);
        }



        // DELETE: api/Journeys/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Journey>> DeleteJourney(int id)
        {
            var journey = await _context.Journeys.FindAsync(id);
            if (journey == null)
            {
                return NotFound();
            }

            _context.Journeys.Remove(journey);
            await _context.SaveChangesAsync();

            return journey;
        }

        private bool JourneyExists(int id)
        {
            return _context.Journeys.Any(e => e.Id == id);
        }



        // code will return the info from journey which is necessary for chart report
        // GET: api/report
        [HttpPost]
        [Route("/api/report")]
        public IActionResult chartReport(Report report)
        {
            {
                //return the info from database
                var journeyReport = _context.Journeys.Where(x => x.Vehicle.LicensePlate == report.LicensePlate).ToList();

                var countJourney20 = 0;
                var countJourney50 = 0;
                var countJourney200 = 0;

                foreach (var item in journeyReport)
                {
                    if ((item.DateTime >= report.DateTimeStart.AddHours(2)) && (item.DateTime <= report.DateTimeStop.AddHours(25).AddMinutes(59)))
                    {

                        if ((item.MeterStop - item.MeterStart) <= 20)
                        {
                            countJourney20 = countJourney20 + 1;

                        }
                        if ((item.MeterStop - item.MeterStart) > 20 && (item.MeterStop - item.MeterStart) <= 50)
                        {
                            countJourney50 = countJourney50 + 1;
                        }
                        if ((item.MeterStop - item.MeterStart) > 50)
                        {
                            countJourney200 = countJourney200 + 1;
                        }
                    }
                }

                var length = new int[] { countJourney20, countJourney50, countJourney200 };
                

                return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(length));
               

            }
        }
    }
}
