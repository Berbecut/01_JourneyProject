using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Project_v02.Areas.Identity.Data;
using Project_v02.Models;


namespace Project_v02.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase //???? Controller or ControllerBase
    {

        private readonly UserManager<User> _userManager; // ????? User or IdentityUser 
        private readonly SignInManager<User> _signInManager;

        public UsersController(
            UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }




        [HttpPost]
        [Route("/api/Users")] 
        public async Task<IActionResult> LoginAsync([FromBody] PostRegister postRegister)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(postRegister.Email);
            if (user == null)
            {
                return BadRequest();
            }
            var passwordSignInResult = await _signInManager.PasswordSignInAsync(user, postRegister.Password, isPersistent: true, lockoutOnFailure: false);
            if (!passwordSignInResult.Succeeded)
            {
                return BadRequest();
            }
            var tokenString = GenerateJSONWebToken(postRegister.Email);
            return Ok(new { token = tokenString, email = user.Email }); 
        }


        [HttpPost]
        [Route("/register")]
        public async Task<IActionResult> RegisterAsync([FromBody] PostRegister postRegister)
        {

            var user = new User();

            user.UserName = postRegister.Email;
            user.Email = postRegister.Email;
            user.FirstName = postRegister.FirstName;
            user.LastName = postRegister.LastName;

            var result = await _userManager.CreateAsync(user, postRegister.Password);

            return Ok(result);

        }



        [HttpGet]
        [Route("/testing")]
        [Authorize]
        public IActionResult Testing()
        {
            return Ok();
        }


        private string GenerateJSONWebToken(string Email)
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("mySecretKeyString"));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, Email),
            new Claim(JwtRegisteredClaimNames.Email, Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

                var token = new JwtSecurityToken("domain.com",
                  "domain.com",
                  claims,
                  expires: DateTime.Now.AddMinutes(120),
                  signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }

    }
}