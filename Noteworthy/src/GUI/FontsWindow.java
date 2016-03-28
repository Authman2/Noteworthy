package GUI;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JList;
import javax.swing.JPanel;

public class FontsWindow extends JFrame {
	private static final long serialVersionUID = -5137305296724982575L;

	
	JList<Font> fontList = new JList<Font>();
	
	
	
	public FontsWindow() {
		setSize(250,300);
        setLocationRelativeTo(null);
        setResizable(false);
		
        
        /* INITIAL SETUP */
        addFonts();
        
        /* PANEL SETUP */
        JPanel west = new JPanel(new GridLayout(1,1,10,10));
        	west.add(fontList);
        
        Container pane = getContentPane();
        	pane.add(west, BorderLayout.WEST);
        	
		
        
	}



	private void addFonts() {
		fontList.setListData(new Font[] {new Font("Arial",0,15),
										 new Font("Calibri",0,15),
										 new Font("Avenir",0,15),
										 new Font("Avenir Next",0,15),
										 new Font("Bell MT",0,15),
										 new Font("Bradley Hand",0,15),
										 new Font("Britannic Bold",0,15),
										 new Font("Bush Script MT",0,15),
										 new Font("Chalkboard SE",0,15),
										 new Font("Chaparral Pro",0,15),
										 new Font("Cochin",0,15),
										 new Font("Comic Sans MS",0,15),
										 new Font("Constantia",0,15),
										 new Font("Courier",0,15),
										 new Font("Curiz MT",0,15)});
	}


	
	
	
	
}
