package EXTRA;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.util.Locale;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

import com.dropbox.core.DbxAppInfo;
import com.dropbox.core.DbxAuthFinish;
import com.dropbox.core.DbxClient;
import com.dropbox.core.DbxException;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.DbxWebAuthNoRedirect;

public class LogInWindow extends JFrame {
	private static final long serialVersionUID = -6478430496391062448L;
	
	//This jframe
	LogInWindow lisuw = this;
	
	//Display info to the user
	JTextField infoLabel1 = new JTextField();
	JLabel infoLabel2 = new JLabel();
	JLabel infoLabel3 = new JLabel();
	
	//Area for getting data
	JLabel authCodeL = new JLabel();
	JTextField authCodeField = new JTextField();
	
	//Signing in
	public JButton select = new JButton();
	
	
	//Dropbox stuff
	DbxRequestConfig config;
	DbxWebAuthNoRedirect webAuth;
	public static DbxClient client;
	String authorizeUrl = "";
	
	//If the user is successfully connected to dropbox
	public static boolean connected = false;
	
	
	public LogInWindow(String text) {
		super(text);
		setSize(600,240);
		setLocationRelativeTo(null);
		
		//Set up the dropbox connection
		setup();
		
		//Panel stuff
		JPanel north = new JPanel(new GridLayout(6,1,5,5));
			north.add(infoLabel1);
			north.add(infoLabel2);
			north.add(infoLabel3);
			north.add(authCodeL);
			north.add(authCodeField);
			north.add(select);
			
		getContentPane().add(north, BorderLayout.NORTH);
		select.addActionListener(new actions());
	}
	
	
	/** Initial setup before actually connecting to the server. */
	public void setup() {
		final String APP_KEY = "zfu9ixjwyzxypqo";
        final String APP_SECRET = "oj1nrogmzoiz16e";

        DbxAppInfo appInfo = new DbxAppInfo(APP_KEY, APP_SECRET);

        config = new DbxRequestConfig("JAVANoteworthy/1.0", Locale.getDefault().toString());
        webAuth = new DbxWebAuthNoRedirect(config, appInfo);

        // Have the user sign in and authorize your app.
        authorizeUrl = webAuth.start();
        infoLabel1.setText("1. Go to: " + authorizeUrl);
        infoLabel2.setText("2. Click \"Allow\" (you might have to log in first)");
        infoLabel3.setText("3. Copy the authorization code.");
	}
	
	/** Create the Dropbox client for adding and gathering information from. */
	public void authenticate() throws IOException, DbxException {  
		
        String code = authCodeField.getText().trim();

        // This will fail if the user enters an invalid authorization code.
        DbxAuthFinish authFinish = webAuth.finish(code);
        String accessToken = authFinish.accessToken;
        client = new DbxClient(config, accessToken);

        System.out.println(client.getAccountInfo().toString());
        connected = true;
        JOptionPane.showMessageDialog(this, "You have successfully connected to dropbox!", "Dropbox Connect", 1);
	}
	
	
	public class actions implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			try {
				authenticate();
				lisuw.dispose();
			} catch(Exception err) {
				connected = false;
				JOptionPane.showMessageDialog(lisuw, "There was an issue connecting to your Dropbox account.");
				err.printStackTrace();
			}
		}
	}

	
}
