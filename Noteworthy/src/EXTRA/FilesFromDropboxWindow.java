package EXTRA;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JList;
import javax.swing.JPanel;

public class FilesFromDropboxWindow extends JFrame {
	private static final long serialVersionUID = 3828896373485782482L;

	//A list of the files
	JList<String> dropboxFiles = new JList<String>();
	
	
	public FilesFromDropboxWindow() {
		super("Files From Dropbox");
		setSize(400, 500);
		setLocationRelativeTo(null);
		
		JPanel p = new JPanel(new GridLayout(1,1,1,1));
			p.add(dropboxFiles);
			
		add(p, BorderLayout.CENTER);
	}

}
