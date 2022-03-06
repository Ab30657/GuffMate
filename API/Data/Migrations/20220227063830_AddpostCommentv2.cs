using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class AddpostCommentv2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Guffs_GuffId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Guffs_GuffId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Guffs_AspNetUsers_UserId",
                table: "Guffs");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GuffId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Guffs",
                table: "Guffs");

            migrationBuilder.DropColumn(
                name: "GuffId",
                table: "AspNetUsers");

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

            migrationBuilder.CreateTable(
                name: "UserLikePost",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    GuffId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLikePost", x => new { x.UserId, x.GuffId });
                    table.ForeignKey(
                        name: "FK_UserLikePost_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLikePost_Guff_GuffId",
                        column: x => x.GuffId,
                        principalTable: "Guff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserLikePost_GuffId",
                table: "UserLikePost",
                column: "GuffId");

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Guff_GuffId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Guff_AspNetUsers_UserId",
                table: "Guff");

            migrationBuilder.DropTable(
                name: "UserLikePost");

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

            migrationBuilder.AddColumn<int>(
                name: "GuffId",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Guffs",
                table: "Guffs",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_GuffId",
                table: "AspNetUsers",
                column: "GuffId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Guffs_GuffId",
                table: "AspNetUsers",
                column: "GuffId",
                principalTable: "Guffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

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
        }
    }
}
