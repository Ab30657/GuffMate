using System.Threading.Tasks;
using System.Text;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.Helpers;
using API.SignalR;
using System;
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
			services.AddSingleton<PresenceTracker>();
			services.Configure<CloudinarySettings>(_config.GetSection("CloudinarySettings"));
			services.Configure<TwilioSettings>(_config.GetSection("TwilioSettings"));
			services.Configure<GoogleSettings>(_config.GetSection("GoogleAuthSettings"));
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddScoped<LogUserActivity>();
			services.AddScoped<ITwilioService, TwilioService>();
			services.AddScoped<IPhotoService, PhotoService>();
			services.AddScoped<ITokenService, TokenService>();
			services.AddDbContext<DataContext>(options =>
			{
				var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

				string connStr;

				//a Depending on if in development or production, use either Heroku-provided
				// connection string, or development connection string from env var.
				if (env == "Development")
				{
					// Use connection string from file.
					connStr = _config.GetConnectionString("DefaultConnection");
				}
				else
				{
					// Use connection string provided at runtime by Heroku.
					var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

					// Parse connection URL to connection string for Npgsql
					connUrl = connUrl.Replace("postgres://", string.Empty);
					var pgUserPass = connUrl.Split("@")[0];
					var pgHostPortDb = connUrl.Split("@")[1];
					var pgHostPort = pgHostPortDb.Split("/")[0];
					var pgDb = pgHostPortDb.Split("/")[1];
					var pgUser = pgUserPass.Split(":")[0];
					var pgPass = pgUserPass.Split(":")[1];
					var pgHost = pgHostPort.Split(":")[0];
					var pgPort = pgHostPort.Split(":")[1];

					connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};sslmode= Prefer;Trust Server Certificate= true";
				}

				// Whether the connection string came from the local development configuration file
				// or from the environment variable from Heroku, use it to set up your DbContext.
				options.UseNpgsql(connStr);
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
					ValidateLifetime = true,
					ClockSkew = TimeSpan.FromSeconds(0)
				};

				opt.Events = new JwtBearerEvents
				{
					OnMessageReceived = context =>
					{
						var accessToken = context.Request.Query["access_token"];
						var path = context.HttpContext.Request.Path;
						if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
						{
							context.Token = accessToken;
						}
						return Task.CompletedTask;
					}
				};
			});
			services.AddIdentityCore<AppUser>(opt =>
			{

			}).AddRoles<AppRole>().AddRoleManager<RoleManager<AppRole>>().AddSignInManager<SignInManager<AppUser>>().AddRoleValidator<RoleValidator<AppRole>>().AddEntityFrameworkStores<DataContext>();

			services.AddSignalR();
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

			app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:4200"));

			app.UseAuthentication();

			app.UseAuthorization();

			app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				endpoints.MapHub<PresenceHub>("hubs/presence");
				endpoints.MapHub<MessageHub>("hubs/message");
				endpoints.MapHub<GuffHub>("hubs/guffs");
				endpoints.MapFallbackToController("Index", "Fallback");
			});
		}
	}
}
