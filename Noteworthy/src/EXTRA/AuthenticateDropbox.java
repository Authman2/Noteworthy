package EXTRA;

import com.dropbox.core.DbxClient;
import com.dropbox.core.DbxRequestConfig;

/** Just used for authenticating one's dropbox account. */
public class AuthenticateDropbox {

	//App key    dpfwdwrv3xw0ykw
	//App secret    gki48k1fxlqqz7g
	private static String ACCESS_TOKEN = "<ACCESS TOKEN>";
	
	public AuthenticateDropbox() {
		 // Create Dropbox client
        DbxRequestConfig config = new DbxRequestConfig("dropbox/Noteworthy", "en_US");
        DbxClient client = new DbxClient(config, ACCESS_TOKEN);
        
        // Get current account info
        //FullAccount account = client.users().getCurrentAccount();
        //System.out.println(client.getName().getDisplayName());
	}

}
