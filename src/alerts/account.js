import { h, Mosaic } from "@authman2/mosaic";
import firebase from 'firebase';
import Globals from "../other/Globals";

/** A full screen alert that asks the user for information to make either a new notebook or new note. */
export default new Mosaic({
    data: {
        currentUser: null
    },
    actions: {
        closeAlert() {
            document.getElementsByClassName('fullscreen-alert')[0].className += '-close';
            
        },
        sendPasswordResetEmail() {
            firebase.auth().sendPasswordResetEmail(this.data.currentUser.email);

            Globals.showActionAlert(`Sent a password reset email!`, Globals.ColorScheme.blue);
        },
        handleLogout() {
            this.parent.actions.handleLogout();
        }
    },
    view() {
        return <div class='fullscreen-alert'>
            <button class='close-btn' onclick={this.actions.closeAlert}><span class='fa fa-times'/></button>

            <h1 class='fullscreen-alert-title'>Account</h1>
            <h4 class='fullscreen-alert-subtitle'>
                You are currently logged in as {this.data.currentUser ? this.data.currentUser.email : ""}
            </h4>

            <br/>
            <button class='fullscreen-alert-btn' onclick={this.actions.sendPasswordResetEmail}>
                Click to send Password Reset Email
            </button>
            <br/>
            <button class='fullscreen-alert-btn' onclick={this.actions.handleLogout}>
                Logout
            </button>
        </div>
    },
});