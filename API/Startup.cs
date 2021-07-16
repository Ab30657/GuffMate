using System.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.Helpers;

namespace API
{
	public class Startup
	{
		private readonly IConfiguration _config;
		public Startup(IConfiguration config)
		{
			_config = config;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.Configure<CloudinarySettings>(_config.GetSection("CloudinarySettings"));
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			services.AddScoped<IInterestRepository, InterestRepository>();
			services.AddScoped<IUserRepository, UserRepository>();
			services.AddScoped<IPhotoService, PhotoService>();
			services.AddScoped<ITokenService, TokenService>();
			services.AddDbContext<DataContext>(options =>
			{
				options.UseSqlite(_config.GetConnectionString("DefaultConnection"));
			});
			services.AddControllers();
			services.AddCors();
			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
			{
				opt.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])),
					ValidateIssuer = false,
					ValidateAudience = false,
				};
			});

			services.AddIdentityCore<AppUser>(opt =>
			{

			}).AddRoles<AppRole>().AddRoleManager<RoleManager<AppRole>>().AddSignInManager<SignInManager<AppUser>>().AddRoleValidator<RoleValidator<AppRole>>().AddEntityFrameworkStores<DataContext>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

			app.UseAuthentication();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
