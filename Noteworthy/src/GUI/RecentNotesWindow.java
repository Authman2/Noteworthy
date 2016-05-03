package GUI;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ScrollPaneConstants;

import com.dropbox.core.DbxEntry;

import EXTRA.LogInWindow;
import contents.Load;
import contents.ReadFile;
import contents.TextStyle;


/**Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
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
	
	//The list of notes from dropbox
	public static JList<String> sharedNotes = new JList<String>();
	
	//Label to display it
	JLabel sharedNotesL = new JLabel("Shared Notes");
	
	//Button for opening shared notes
	JButton openShared = new JButton("Open");
	
	
	public RecentNotesWindow(JPanel gui) {
		update();
		
		JScrollPane scroller = new JScrollPane(recentNotes, ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		JScrollPane scroller2 = new JScrollPane(sharedNotes, ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);

		setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
		this.add(panelInfoLabel);
		this.add(openRecent);
		this.add(scroller);
		this.add(sharedNotesL);
		this.add(openShared);
		this.add(scroller2);
		
		
		openRecent.addActionListener(new ActionListener() {

			@SuppressWarnings("unchecked")
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					String s = recentNotes.getSelectedValue();
					File f = new File(recents.get(recentNotes.getSelectedIndex()).getAbsolutePath());
					String pathWOFileName = f.getAbsolutePath().substring(0, f.getAbsolutePath().length()-f.getName().length());
					
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
						((GUIWindow)gui).textstyles = (ArrayList<TextStyle>) loader.LoadFile(((GUIWindow)gui).textstyles, pathWOFileName + "/" + f.getName().substring(0, f.getName().length()-5) + "_styles");
						 
						//Set the style attributes again
						for(TextStyle ts : ((GUIWindow)gui).textstyles) {
							ts.setTextPane(((GUIWindow)gui).noteArea);
							ts.addStyle();
						}
						
						s = null;
						f = null;
						pathWOFileName = null;
						
					} else {
						JOptionPane.showMessageDialog(gui, "The file " + "\"" + s + "\"" + " was not found.");
					}
					
				} catch(NullPointerException e1) {
					System.err.println("You have to select a file.");
					JOptionPane.showMessageDialog(gui, "You have to select a file.");
				}
				
			}
			
		});
		openShared.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				if(LogInWindow.connected) {
					DbxEntry.WithChildren listing = null;
					try {
						listing = LogInWindow.client.getMetadataWithChildren("/");
					} catch(Exception e1) {
						e1.printStackTrace();
					}
			        System.out.println("Files in the root path:");
			        for (DbxEntry child : listing.children) {
			            System.out.println("	" + child.name + ": " + child.toString());
			        }
			
			        FileOutputStream outputStream = null;
					try {
						outputStream = new FileOutputStream(sharedNotes.getSelectedValue());
					} catch (FileNotFoundException e1) {
						e1.printStackTrace();
					}
			        try {
			            DbxEntry.File downloadedFile = null;
						try {
							downloadedFile = LogInWindow.client.getFile("/magnum-opus.txt", null,
							    outputStream);
						} catch (Exception err) {
							err.printStackTrace();
						}
			            System.out.println("Metadata: " + downloadedFile.toString());
			        } finally {
			            try {
							outputStream.close();
						} catch (IOException e1) {
							e1.printStackTrace();
						}
			        }
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
