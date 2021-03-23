using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Certificate;
using StockScreener.Controllers;
using Microsoft.Owin.Cors;

namespace StockScreener
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(
                    CertificateAuthenticationDefaults.AuthenticationScheme)
                    .AddCertificate();
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddCors(options =>
        {
            options.AddPolicy(MyAllowSpecificOrigins,
                              builder =>
                              {
                                  builder.WithOrigins("https://localhost:5000",
                                                      "https://localhost:44362")
                                                      .SetIsOriginAllowedToAllowWildcardSubdomains()
                                                      .AllowAnyHeader();

                              });
        });

            services.AddHttpsRedirection(options =>
            {
                options.HttpsPort = 44362;
            });



            services.AddSignalR();
            services.AddSignalRCore();

            // Add Signal R as a Hosted Service
            services.AddHostedService<Worker>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            }

            

            //CorsOptions.AllowAll
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseHsts();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseWebSockets();
            app.UseRouting();
            app.UseCors(builder =>
            {
                builder.WithOrigins("https://localhost:44362")
                .AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            });
            app.UseCookiePolicy();
            app.UseCors("CorsPolicy");


            // For controllers and views only
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=DummyOne}/{page}");
                endpoints.MapControllers();
               
                endpoints.MapHub<StockHandler>("stock");

                /* endpoints.MapContr endpoints.MapRazorPages();ollerRoute(
                     name: "",
                     pattern: "{controller}/{action=Dummy}");*/
            });

            //https://www.c-sharpcorner.com/uploadfile/bhushanbhure/websocket-server-using-httplistener-and-client-with-client/
            app.UseSpa(
            spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
