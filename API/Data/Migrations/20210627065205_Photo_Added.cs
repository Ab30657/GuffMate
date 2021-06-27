using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class Photo_Added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Photos_DisplayPhotoId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_DisplayPhotoId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DisplayPhotoId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Photos",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsMain",
                table: "Photos",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_AspNetUsers_AppUserId",
                table: "Photos",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_AspNetUsers_AppUserId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "IsMain",
                table: "Photos");

            migrationBuilder.AddColumn<int>(
                name: "DisplayPhotoId",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_DisplayPhotoId",
                table: "AspNetUsers",
                column: "DisplayPhotoId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Photos_DisplayPhotoId",
                table: "AspNetUsers",
                column: "DisplayPhotoId",
                principalTable: "Photos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
