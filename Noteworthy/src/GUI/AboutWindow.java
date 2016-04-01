package GUI;

import java.awt.BorderLayout;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class AboutWindow extends JFrame {
	private static final long serialVersionUID = 3078023730240644548L;

	
	JLabel infoLabel = new JLabel();
	
	public AboutWindow(String title) {
		super(title);
		setSize(500,300);
		setLocationRelativeTo(null);
		
		infoLabel.setBounds(10, 10, 480, 280);
		infoLabel.setText("<html> Welcome to Noteworthy, an easy to use note taking application. Noteworthy is for everyone, from"
				+ "  elementary school aged children to adults in the workforce. Noteworthy can be used for anything from small,"
				+ "  quick notes to large, fully developed essays."
				+ "<br><br> Created by: Adeola Uthman"
				+ "<br> Version: 1.0"
				+ "<br> Copyright (c) Adeola Uthman 2016</html>");
		
		JPanel center = new JPanel(new GridLayout(1,1,10,10));
			center.add(infoLabel);
			
		getContentPane().add(center, BorderLayout.CENTER);
	}

}
