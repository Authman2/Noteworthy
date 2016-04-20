package GUI;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.ArrayList;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ScrollPaneConstants;

import contents.Load;
import contents.ReadFile;
import contents.TextStyle;

public class RecentNotesWindow extends JPanel {
	private static final long serialVersionUID = -2542723171578951529L;

	//The array of recently viewed notes to display on screen
	public static ArrayList<File> recents = new ArrayList<File>();
	public static ArrayList<String> recentsPaths = new ArrayList<String>();
	
	//The JList to be displayed on screen.
	public static JList<String> recentNotes = new JList<String>();
	
	//Label for displaying info
	JLabel panelInfoLabel = new JLabel("<html> <b> Recents </b> </html>");
	
	//Button for opening a recent file
	JButton openRecent = new JButton("Open");
	
	
	
	public RecentNotesWindow(JPanel gui) {
		update();
		
		recentNotes.setVisibleRowCount(25);		
		JScrollPane scroller = new JScrollPane(recentNotes, ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);
			
		setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
		this.add(panelInfoLabel);
		this.add(openRecent);
		this.add(scroller);
		
		
		openRecent.addActionListener(new ActionListener() {

			@SuppressWarnings("unchecked")
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					String s = recentNotes.getSelectedValue();
					File f = new File(recents.get(recentNotes.getSelectedIndex()).getAbsolutePath());
					
					//If the file still exists
					if(f.exists()) {
						//Using my "ReadFile" class.
						ReadFile reader = new ReadFile();
					 	String loadedNote = "";
					
					 	//Try loading the file's text
					 	try { loadedNote = (String)reader.Read(f.getPath()); } catch (Exception e1) { e1.printStackTrace(); }
			        
					 	//Set the texts
					 	if(f.getName().endsWith(".ntwy"))
					 		((GUIWindow)gui).titleField.setText(f.getName().substring(0, f.getName().length()-5));
					 	else
					 		((GUIWindow)gui).titleField.setText(f.getName().substring(0, f.getName().length()-4));
					 	((GUIWindow)gui).noteArea.setText(loadedNote.substring(7));
					 
						 
						//Load all of the styling attributes
						Load loader = new Load();
						((GUIWindow)gui).textstyles = (ArrayList<TextStyle>) loader.LoadFile(((GUIWindow)gui).textstyles, ((GUIWindow)gui).fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + f.getName().substring(0, f.getName().length()-5) + "_styles");
						 
						//Set the style attributes again
						for(TextStyle ts : ((GUIWindow)gui).textstyles) {
							ts.setTextPane(((GUIWindow)gui).noteArea);
							ts.addStyle();
						}
					} else {
						JOptionPane.showMessageDialog(gui, "The file " + "\"" + s + "\"" + " was not found.");
					}
					
				} catch(NullPointerException e1) {
					System.err.println("You have to select a file.");
					JOptionPane.showMessageDialog(gui, "You have to select a file.");
				}
				
			}
			
		});
	}
	
	public static void update() {
		String[] noteNames = new String[recents.size()];
		for(int i = 0; i < noteNames.length; i++) {
			noteNames[i] = recents.get(i).getName();
		}
		recentNotes.setListData(noteNames);
	}

}
