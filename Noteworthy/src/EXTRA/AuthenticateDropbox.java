package EXTRA;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Locale;

import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.DbxAuthFinish;
import com.dropbox.core.DbxClient;
import com.dropbox.core.DbxException;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.DbxWebAuthNoRedirect;

/** Just used for authenticating one's dropbox account. 
 * Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details. */
public class AuthenticateDropbox {

	/* My unique access token for my dropbox account */
	private static String ACCESS_TOKEN = "TmPoZNg4MRAAAAAAAAAKpsYDJqMhJPhYvYNQUCmLg6puYIdOVdvnA7ZrGP-uJLIC";
	
	
	public static void main(String[] args) throws IOException, DbxException {
		// Create Dropbox client
//        DbxRequestConfig config = new DbxRequestConfig("JAVANoteworthy", "en_US");
//        DbxClient client = new DbxClient(config, ACCESS_TOKEN);
//
//        // Get current account info
//        System.out.println(client.getAccountInfo().displayName);
		
		
		
		final String APP_KEY = "zfu9ixjwyzxypqo";
        final String APP_SECRET = "oj1nrogmzoiz16e";

        DbxAppInfo appInfo = new DbxAppInfo(APP_KEY, APP_SECRET);

        DbxRequestConfig config = new DbxRequestConfig("JAVANoteworthy/1.0", Locale.getDefault().toString());
        DbxWebAuthNoRedirect webAuth = new DbxWebAuthNoRedirect(config, appInfo);

        // Have the user sign in and authorize your app.
        String authorizeUrl = webAuth.start();
        System.out.println("1. Go to: " + authorizeUrl);
        System.out.println("2. Click \"Allow\" (you might have to log in first)");
        System.out.println("3. Copy the authorization code.");
        String code = new BufferedReader(new InputStreamReader(System.in)).readLine().trim();

        // This will fail if the user enters an invalid authorization code.
        DbxAuthFinish authFinish = webAuth.finish(code);
        String accessToken = authFinish.accessToken;

        DbxClient client = new DbxClient(config, accessToken);

        System.out.println("Linked account: " + client.getAccountInfo().displayName);

        
        //Create a test folder
        System.out.println(client.createFolder("/WorkingFolder").toStringMultiline());
        
        
        
        /* UPLOADING FILE */
//        File inputFile = new File("working-draft.txt");
//        FileInputStream inputStream = new FileInputStream(inputFile);
//        try {
//            DbxEntry.File uploadedFile = client.uploadFile("/magnum-opus.txt",
//                DbxWriteMode.add(), inputFile.length(), inputStream);
//            System.out.println("Uploaded: " + uploadedFile.toString());
//        } finally {
//            inputStream.close();
//        }

        
        /* READING FILES */
//        DbxEntry.WithChildren listing = client.getMetadataWithChildren("/");
//        System.out.println("Files in the root path:");
//        for (DbxEntry child : listing.children) {
//            System.out.println("	" + child.name + ": " + child.toString());
//        }
//
//        FileOutputStream outputStream = new FileOutputStream("magnum-opus.txt");
//        try {
//            DbxEntry.File downloadedFile = client.getFile("/magnum-opus.txt", null,
//                outputStream);
//            System.out.println("Metadata: " + downloadedFile.toString());
//        } finally {
//            outputStream.close();
//        }
        
	}

}
