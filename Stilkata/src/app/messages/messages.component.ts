import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesService } from '../messages.service';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messagesList: Array<any> = [];
  isUserLoggedIn = false;

  constructor(
    private messagesService: MessagesService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.userService.isUserLoggedIn();
    this.fetchMessages();
  }

  fetchMessages(): void {
    if (!this.isUserLoggedIn) return;

    this.messagesService.getMessages().subscribe({
      next: (messages) => {
        this.messagesList = messages;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
        alert('Failed to fetch messages.');
      },
    });
  }

  deleteMessages(): void {
    if (!this.isUserLoggedIn) return;

    const username = this.tokenService.getLoggedInUser();
    if (!username) {
      alert('Invalid session. Please log in again.');
      return;
    }

    
    const confirmation = confirm('Are you sure you want to delete all messages?');
    if (!confirmation) return;

    this.messagesService.deleteMessages(username).subscribe({
      next: () => {
        alert('All messages deleted successfully.');
        this.router.navigate(['/messages']).then(() => {
          window.location.reload(); 
        });
      },
      error: (err) => {
        console.error('Error deleting messages:', err);
        alert('Failed to delete messages.');
      },
    });
  }
}
