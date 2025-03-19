import { Component, OnInit } from "@angular/core";
import { RecordsService } from "../records.service";
import { TokenService } from "../token.service";
import { UserService } from "../user.service";

@Component({
  selector: "app-records",
  templateUrl: "./records.component.html",
  styleUrls: ["./records.component.css"],
})
export class RecordsComponent implements OnInit {
  scoresList: Array<any> = [];
  userScoresList: Array<any> = [];
  isUserLoggedIn = false;

  constructor(
    private scores: RecordsService,
    private userService: UserService,
    private tokenMng: TokenService
  ) {}

  listScores() {
    this.scores.getScores().subscribe({
      next: (values) => {
        this.scoresList = values.sort(
          (a: any, b: any) =>
            new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
        );
      },
      error: (err) => {
        console.error("Error fetching scores:", err);
      },
    });

    if (this.isUserLoggedIn) {
      const user = this.tokenMng.getLoggedInUser();
      if (!user) {
        return;
      }
      this.scores.getScoresByUser(user).subscribe({
        next: (values) => {
          this.userScoresList = values.sort(
            (a: any, b: any) =>
              new Date(b.recordDate).getTime() -
              new Date(a.recordDate).getTime()
          );
        },
        error: (err) => {
          console.error("Error fetching user scores:", err);
        },
      });
    }
  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.userService.isUserLoggedIn();
    this.listScores();
  }
}
