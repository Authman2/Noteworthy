package GUI;

import java.awt.BorderLayout;
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
import javax.swing.text.DefaultHighlighter;

public class FindReplaceWindow extends JFrame {
	private static final long serialVersionUID = 496143735014291910L;

	//Labels and text fields for finding and replacing
	JLabel findLabel = new JLabel(" Find: ");
    JTextField findTF = new JTextField();
    JLabel replaceLabel = new JLabel(" Replace: ");
    JTextField replaceTF = new JTextField();
    
    //Label and JPanel to display the not found exception
    JLabel stringNotFoundLabel = new JLabel();
    JPanel center;
    
    //Buttons that carry out the actions
    JButton find = new JButton("Find");
    JButton replace = new JButton("Replace");
    JButton replaceAll = new JButton("Replace All");
    
    //Text area for getting information
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
            
        center = new JPanel(new GridLayout(1,1,10,10));
        	center.add(stringNotFoundLabel);
        
        JPanel south = new JPanel(new GridLayout(1,3,10,10));
            south.add(find);
            south.add(replace);
            south.add(replaceAll);
        
        Container pane = getContentPane();
        pane.add(north, BorderLayout.NORTH);
        pane.add(center, BorderLayout.CENTER);
        pane.add(south, BorderLayout.SOUTH);
        
        find.addActionListener(new frActions());
        replace.addActionListener(new frActions());
        replaceAll.addActionListener(new frActions());
    }
    
    
    
    public class frActions implements ActionListener {

        @Override
        public void actionPerformed(ActionEvent e) {
            //Find
            if(e.getSource() == find) {
                //If it's not the empty string
                if(!findTF.getText().equals("")) {
	                for(int i = 0; i < textarea.getText().length() - findTF.getText().length(); i++) {
	                	//If you find the word, try highlighting it.
	                    if(textarea.getText().substring(i,i+findTF.getText().length()).equals(findTF.getText())) {
	                        try {
	                        	textarea.getHighlighter().addHighlight(i, i+findTF.getText().length(), DefaultHighlighter.DefaultPainter);
	                        } catch(Exception err) {
	                            stringNotFoundLabel.setText("String was not found");
	                            center.repaint();
	                            System.err.println("String was not found");
	                        }  
	                    }
	                }
                }
                
            }
            
            //Replace
            if(e.getSource() == replace) {
                String replacement = textarea.getText().replaceFirst(findTF.getText(), replaceTF.getText());
                textarea.setText(replacement);
                
            }
            
            //Replace all
            if(e.getSource() == replaceAll) {
                String replacement = textarea.getText().replaceAll(findTF.getText(), replaceTF.getText());
                textarea.setText(replacement);
            }
        }
        
    }
    
}
