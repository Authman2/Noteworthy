package GUI;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.JTextField;

public class FindReplaceWindow extends JFrame {
	private static final long serialVersionUID = 496143735014291910L;

	
	JLabel findLabel = new JLabel(" Find: ");
	JTextField findTF = new JTextField();
	JLabel replaceLabel = new JLabel(" Replace: ");
	JTextField replaceTF = new JTextField();
	JButton find = new JButton("Find");
	JButton replace = new JButton("Replace");
	
	JTextArea textarea;
	
	public FindReplaceWindow(String title, JTextArea jta) {
		super(title);
		setSize(400,130);
		setLocationRelativeTo(null);
		setResizable(false);
		
		textarea = jta;
		
		JPanel north = new JPanel(new GridLayout(2,2,10,10));
			north.add(findLabel);
			north.add(findTF);
			north.add(replaceLabel);
			north.add(replaceTF);
		
		JPanel south = new JPanel(new GridLayout(1,2,10,10));
			south.add(find);
			south.add(replace);
		
		Container pane = getContentPane();
		pane.add(north, BorderLayout.NORTH);
		pane.add(south, BorderLayout.SOUTH);
		
		find.addActionListener(new frActions());
		replace.addActionListener(new frActions());
	}
	
	
	
	public class frActions implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			//Find
			if(e.getSource() == find) {
				
				for(int i = 0; i < textarea.getText().length(); i++) {
					if(textarea.getText().substring(i).equals(findTF.getText())) {
						textarea.setSelectionColor(Color.yellow);
						textarea.getText().substring(i, findTF.getText().length());
					}
				}
				
			}
			
			//Replace
			if(e.getSource() == replace) {
				String replacement = textarea.getText().replaceAll(findTF.getText(), replaceTF.getText());
				textarea.setText(replacement);
				
			}
			
			
		}
		
	}
	
}
