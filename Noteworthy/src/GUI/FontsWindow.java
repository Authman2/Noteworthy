package GUI;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.ScrollPaneConstants;

public class FontsWindow extends JFrame {
	private static final long serialVersionUID = -5137305296724982575L;

	//The font that the user will choose.
	Font font;
	
	//Text area for getting information
	JTextArea textarea;
	
	//Labels for showing what each list does
	JLabel fontsLabel = new JLabel("Fonts:");
	JLabel styleLabel = new JLabel("Style:");
	JLabel sizeLabel = new JLabel("Size:");
	
	//Lists for choosing the font, style, and size
	JList<String> fontList = new JList<String>();
	JList<String> styleList = new JList<String>();
	JList<Integer> sizeList = new JList<Integer>();
	
	//Button for actually changing the font
	JButton selectButton = new JButton("Select");
	
	
	public FontsWindow(String title, JTextArea jta) {
		super(title);
		setSize(415,410);
        setLocationRelativeTo(null);
		
        textarea = jta;
        
        /* INITIAL SETUP */
        addFonts();
        addSizes();
        fontList.setSelectedIndex(11);
        styleList.setSelectedIndex(0);
        sizeList.setSelectedIndex(7);
        
        /* PANEL SETUP */
        JPanel north = new JPanel(new GridLayout(1,4,10,10));
        	north.add(fontsLabel);
        	north.add(styleLabel);
        	north.add(sizeLabel);
        	north.add(selectButton);
        JPanel west = new JPanel(new GridLayout(1,2,10,10));
        	JScrollPane scroller = new JScrollPane(fontList,ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS,ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        	JScrollPane scroller2 = new JScrollPane(sizeList,ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS,ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        	west.add(scroller);
        	west.add(styleList);
        	west.add(scroller2);
        
        Container pane = getContentPane();
        	pane.add(north, BorderLayout.NORTH);
        	pane.add(west, BorderLayout.WEST);
        	
		
        selectButton.addActionListener(new fActions());
	}


	private void addSizes() {
		sizeList.setListData(new Integer[] {2,4,6,8,10,12,14,16,18,20,22,24,26,28,29,30,32,34,36,38,40,42,44,46,48,50});
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


	
	
	public class fActions implements ActionListener {
		public void actionPerformed(ActionEvent e) {
			if(e.getSource() == selectButton) {
				if(styleList.getSelectedValue().toString().equals("Plain"))
					font = new Font(fontList.getSelectedValue(),0,sizeList.getSelectedValue().intValue());
					textarea.setFont(font);
				
				if(styleList.getSelectedValue().toString().equals("Bold"))
					font = new Font(fontList.getSelectedValue(),1,sizeList.getSelectedValue().intValue());
					textarea.setFont(font);
				
				if(styleList.getSelectedValue().toString().equals("Italic"))
					font = new Font(fontList.getSelectedValue(),2, sizeList.getSelectedValue().intValue());
					textarea.setFont(font);
			}
		}
	}
	
}
