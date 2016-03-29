package GUI;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridLayout;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;

public class FontsWindow extends JFrame {
	private static final long serialVersionUID = -5137305296724982575L;

	
	JLabel fontsLabel = new JLabel("Fonts:");
	JLabel styleLabel = new JLabel("Style:");
	
	JList<String> fontList = new JList<String>();
	JList<String> styleList = new JList<String>();
	
	JButton selectButton = new JButton("Select");
	
	
	public FontsWindow(String title) {
		super(title);
		setSize(335,410);
        setLocationRelativeTo(null);
		
        
        /* INITIAL SETUP */
        addFonts();
        
        /* PANEL SETUP */
        JPanel north = new JPanel(new GridLayout(1,3,10,10));
        	north.add(fontsLabel);
        	north.add(styleLabel);
        	north.add(selectButton);
        JPanel west = new JPanel(new GridLayout(1,2,10,10));
        	west.add(fontList);
        	west.add(styleList);
        
        Container pane = getContentPane();
        	pane.add(north, BorderLayout.NORTH);
        	pane.add(west, BorderLayout.WEST);
        	
		
        
	}



	private void addFonts() {
		styleList.setListData(new String[] {"Plain","Bold","Italic"});
		fontList.setListData(new String[] {new Font("Arial",0,15).getName(),
										 new Font("Calibri",0,15).getName(),
										 new Font("Avenir",0,15).getName(),
										 new Font("Avenir Next",0,15).getName(),
										 new Font("Bell MT",0,15).getName(),
										 new Font("Bradley Hand",0,15).getName(),
										 new Font("Britannic Bold",0,15).getName(),
										 new Font("Bush Script MT",0,15).getName(),
										 new Font("Chalkboard SE",0,15).getName(),
										 new Font("Chaparral Pro",0,15).getName(),
										 new Font("Cochin",0,15).getName(),
										 new Font("Comic Sans MS",0,15).getName(),
										 new Font("Constantia",0,15).getName(),
										 new Font("Courier",0,15).getName(),
										 new Font("Curiz MT",0,15).getName(),
										 new Font("Didot",0,15).getName(),
										 new Font("Garamond",0,15).getName(),
										 new Font("Gill Sans",0,15).getName(),
										 new Font("Garamond",0,15).getName(),
										 new Font("Goudy Old Style",0,15).getName(),
										 new Font("Hoefler Text",0,15).getName(),
										 new Font("Iowan Old Style",0,15).getName(),
										 new Font("Kozuka Gothic Pro",0,15).getName(),
										 new Font("Lithos Pro",0,15).getName(),
										 new Font("Lucida Calligraphy",0,15).getName(),
										 new Font("Lucida Handwriting",0,15).getName(),
										 new Font("Microsoft Himalaya",0,15).getName(),
										 new Font("Minion Pro",0,15).getName(),
										 new Font("Mistral",0,15).getName(),
										 new Font("Noteworthy",0,15).getName(),
										 new Font("Nueva Std",0,15).getName(),
										 new Font("Perpetua",0,15).getName(),
										 new Font("PMingLiU",0,15).getName(),
										 new Font("Savoye LET",0,15).getName(),
										 new Font("SignPainter",0,15).getName(),
										 new Font("Tahoma",0,15).getName(),
										 new Font("Tekton Pro",0,15).getName(),
										 new Font("Times",0,15).getName(),
										 new Font("Times New Roman",0,15).getName(),
										 new Font("Trajan Pro",0,15).getName(),
										 new Font("Trattatello",0,15).getName(),
										 new Font("Zapfino",0,15).getName(),
										 new Font("Monotype Corsiva",0,15).getName() });
	}


	
	
	
	
}
