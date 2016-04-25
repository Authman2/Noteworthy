package EXTRA;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class LogInSignUpWindow extends JFrame {
	private static final long serialVersionUID = -6478430496391062448L;
	
	
	JLabel usernameL = new JLabel("Username:");
	JLabel passwordL = new JLabel("Password:");
	
	JTextField usernameField = new JTextField();
	JTextField passwordField = new JTextField();
	
	public JButton select = new JButton();
	
	
	
	public LogInSignUpWindow(String text) {
		super(text);
		setSize(300,200);
		setLocationRelativeTo(null);
		
		
		JPanel north = new JPanel(new GridLayout(5,1,5,5));
			north.add(usernameL);
			north.add(usernameField);
			north.add(passwordL);
			north.add(passwordField);
			north.add(select);
			
		getContentPane().add(north, BorderLayout.NORTH);
		select.addActionListener(new actions());
	}

	
	public class actions implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			
			
			
		}
		
		
	}

	
}
