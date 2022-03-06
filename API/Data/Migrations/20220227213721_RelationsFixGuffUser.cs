using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class RelationsFixGuffUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Guff_GuffId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Guff_AspNetUsers_UserId",
                table: "Guff");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLikePost_Guff_GuffId",
                table: "UserLikePost");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Guff",
                table: "Guff");

            migrationBuilder.RenameTable(
                name: "Guff",
                newName: "Guffs");

            migrationBuilder.RenameIndex(
                name: "IX_Guff_UserId",
                table: "Guffs",
                newName: "IX_Guffs_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Guffs",
                table: "Guffs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Guffs_GuffId",
                table: "Comments",
                column: "GuffId",
                principalTable: "Guffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Guffs_AspNetUsers_UserId",
                table: "Guffs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLikePost_Guffs_GuffId",
                table: "UserLikePost",
                column: "GuffId",
                principalTable: "Guffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Guffs_GuffId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Guffs_AspNetUsers_UserId",
                table: "Guffs");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLikePost_Guffs_GuffId",
                table: "UserLikePost");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Guffs",
                table: "Guffs");

            migrationBuilder.RenameTable(
                name: "Guffs",
                newName: "Guff");

            migrationBuilder.RenameIndex(
                name: "IX_Guffs_UserId",
                table: "Guff",
                newName: "IX_Guff_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Guff",
                table: "Guff",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Guff_GuffId",
                table: "Comments",
                column: "GuffId",
                principalTable: "Guff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Guff_AspNetUsers_UserId",
                table: "Guff",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLikePost_Guff_GuffId",
                table: "UserLikePost",
                column: "GuffId",
                principalTable: "Guff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
