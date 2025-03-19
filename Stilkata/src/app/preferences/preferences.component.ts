import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-preferences', 
  templateUrl: './preferences.component.html', 
  styleUrls: ['./preferences.component.css'], 
})
export class PreferencesComponent implements OnInit {
  // Object to store user preferences like UFO count and game time
  preferences = {
    ufoCount: 1, // Default number of UFOs
    gameTime: 60, // Default game duration in seconds
  };

  // The URL for the server API to save/load preferences
  private readonly SERVER_URL = 'http://localhost:3500/preferences';

  // Flag to determine if the user is logged in
  isLoggedIn = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, // Helps check if the app is running in the browser
    private http: HttpClient, 
    private tokenService: TokenService 
  ) {}

  // This method runs when the component is initialized
  ngOnInit() {
    // Step 1: Check if the user is logged in using the token service
    this.isLoggedIn = this.tokenService.validToken();

    // Step 2: Load preferences from local storage if available
    if (isPlatformBrowser(this.platformId)) { // Ensures this logic only runs in a browser
      const savedUfoCount = localStorage.getItem('ufoCount'); // Get UFO count from local storage
      const savedGameTime = localStorage.getItem('gameTime'); // Get game time from local storage
      if (savedUfoCount && savedGameTime) {
        this.preferences.ufoCount = parseInt(savedUfoCount, 10); // Parse and set UFO count
        this.preferences.gameTime = parseInt(savedGameTime, 10); // Parse and set game time
      }
    }
  }

  // Save preferences locally in the browser's local storage
  savePreferencesLocally() {
    if (isPlatformBrowser(this.platformId)) { // Only proceed if running in a browser
      localStorage.setItem('ufoCount', this.preferences.ufoCount.toString()); // Save UFO count locally
      localStorage.setItem('gameTime', this.preferences.gameTime.toString()); // Save game time locally
      alert('Preferences saved locally!'); // Notify the user
    } else {
      console.warn('localStorage is not available in this environment.'); // Handle non-browser environments
    }
  }

  // Save preferences to the server
  savePreferencesToServer() {
    // Check if the user is logged in
    if (!this.isLoggedIn) {
      alert('You need to log in to save preferences to the server.'); // Notify user to log in
      return; // Stop execution
    }

    // Get the username from the token service
    const username = this.tokenService.getLoggedInUser();
    if (!username) {
      alert('No username found. Please log in again.'); // Handle cases where username is not available
      return; // Stop execution
    }

    // Prepare the preferences object to send to the server
    const preferences = {
      username, // Add the username
      ufos: this.preferences.ufoCount, // Include UFO count
      time: this.preferences.gameTime, // Include game time
    };

    // Make a POST request to save preferences on the server
    this.http.post(this.SERVER_URL, preferences).subscribe({
      next: () => {
        alert('Preferences saved to the server!'); // Notify user of success
      },
      error: (error) => {
        console.error('Error saving preferences to the server:', error); // Log the error
        alert('Failed to save preferences to the server.'); // Notify user of failure
      },
    });
  }

  // Load preferences from the server
  loadPreferencesFromServer() {
    // Check if the user is logged in
    if (!this.isLoggedIn) {
      alert('You need to log in to load preferences from the server.'); // Notify user to log in
      return; // Stop execution
    }

    // Get the username from the token service
    const username = this.tokenService.getLoggedInUser();
    if (!username) {
      alert('No username found. Please log in again.'); // Handle cases where username is not available
      return; // Stop execution
    }

    // Make a GET request to load preferences from the server
    this.http.get<{ ufos: number; time: number }>(`${this.SERVER_URL}/${username}`).subscribe({
      next: (response) => {
        this.preferences.ufoCount = response.ufos; // Update UFO count from server response
        this.preferences.gameTime = response.time; // Update game time from server response
        alert('Preferences loaded from the server!'); // Notify user of success
      },
      error: (error) => {
        console.error('Error loading preferences from the server:', error); // Log the error
        alert('Failed to load preferences from the server.'); // Notify user of failure
      },
    });
  }
}
