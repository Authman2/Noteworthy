package EXTRA;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuItem;
import javax.swing.undo.CannotRedoException;

import GUI.AboutWindow;
import GUI.FindReplaceWindow;
import GUI.GUIWindow;
import GUI.KeyHelpWindow;
import GUI.WordcountWindow;
import contents.ReadFile;
import contents.Save;

public class MenuBar {

	GUIWindow guiwindow;
	
	
	public MenuBar(GUIWindow g) {
		guiwindow = g;
	}

	
	public void setup() {
		JMenu file = new JMenu("File");
		 	JMenuItem NEWNOTE = new JMenuItem("New Note");
		 	JMenuItem OPENNOTE = new JMenuItem("Open Note");
		 	JMenuItem SAVENOTE = new JMenuItem("Save Note");
		 	JMenuItem SAVEAS = new JMenuItem("Save As");
		 	JMenuItem QUIT = new JMenuItem("Quit");
		 	file.add(NEWNOTE);
		 	file.add(OPENNOTE);
		 	file.add(SAVENOTE);
		 	file.add(SAVEAS);
		 	file.add(QUIT);
		 JMenu edit = new JMenu("Edit");
		 	JMenuItem UNDO = new JMenuItem("Undo");
		 	JMenuItem REDO = new JMenuItem("Redo");
		 	JMenuItem FINDREPLACE = new JMenuItem("Find/Replace");
		 	JMenuItem HIGHLIGHT = new JMenuItem("Highlight");
		 	edit.add(UNDO);
		 	edit.add(REDO);
		 	edit.add(FINDREPLACE);
		 	edit.add(HIGHLIGHT);
		 JMenu insert = new JMenu("Insert");
		 	JMenuItem TABLE = new JMenuItem("Table");
		 	insert.add(TABLE);
		 JMenu tools = new JMenu("Tools");
		 	JMenuItem SPELLCHECK = new JMenuItem("Spell Check");
		 	JMenuItem WORDCOUNT = new JMenuItem("Word Count");
		 	tools.add(SPELLCHECK);
		 	tools.add(WORDCOUNT);
		 JMenu window = new JMenu("Window");
		 	JMenuItem MINIMIZE = new JMenuItem("Minimize");
		 	JMenuItem MAXIMIZE = new JMenuItem("Maximize");
		 	window.add(MINIMIZE);
		 	window.add(MAXIMIZE);		 	
		 JMenu help = new JMenu("Help");
		 	JMenuItem ABOUT = new JMenuItem("About");
		 	JMenuItem KEYHELP = new JMenuItem("Key Help");
		 	help.add(ABOUT);
		 	help.add(KEYHELP);
		 	
		 guiwindow.menubar.add(file);
		 guiwindow.menubar.add(edit);
		 guiwindow.menubar.add(insert);
		 guiwindow.menubar.add(tools);
		 guiwindow.menubar.add(window);
		 guiwindow.menubar.add(help);
		 
		 NEWNOTE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				guiwindow.titleField.setText("Title");
				guiwindow.noteArea.setText("Note");
			}
		 });
		 OPENNOTE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				 int val = guiwindow.fileChooser.showOpenDialog(guiwindow);
					
				 if(val == JFileChooser.APPROVE_OPTION) {
					 //The file to grab.
					 File file = guiwindow.fileChooser.getSelectedFile();
					
					 //Using my "ReadFile" class.
					 ReadFile reader = new ReadFile();
					 String loadedNote = "";
					
					 //Try loading the file's text
					 try { loadedNote = (String)reader.Read(file.getPath()); } catch (Exception e1) { e1.printStackTrace(); }
		            
					 //Set the texts
					 if(file.getName().endsWith(".ntwy"))
						 guiwindow.titleField.setText(file.getName().substring(0, file.getName().length()-5));
					 else
						 guiwindow.titleField.setText(file.getName().substring(0, file.getName().length()-4));
					 guiwindow.noteArea.setText(loadedNote.substring(7));
				 }	
			}
		 });
		 SAVENOTE.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
					Save saver = new Save();
					saver.SaveFile(guiwindow.noteArea.getText(), guiwindow.titleField.getText() + ".ntwy");
				}
		 });
		 SAVEAS.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					int val = guiwindow.fileChooser.showSaveDialog(guiwindow);
					
					if(val == JFileChooser.APPROVE_OPTION) {
						Save saver = new Save();
						if(guiwindow.fileChooser.getFileFilter().getDescription().equals("txt -- A plain text file."))
							saver.SaveFile(guiwindow.noteArea.getText(), guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + ".txt");
						else if(guiwindow.fileChooser.getFileFilter().getDescription().equals("ntwy -- A Noteworthy text file."))
							saver.SaveFile(guiwindow.noteArea.getText(), guiwindow.fileChooser.getCurrentDirectory().getAbsolutePath() + "/" + guiwindow.titleField.getText() + ".ntwy");
							
					}
				}
		 });
		 QUIT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
			}			 
		 });
		 UNDO.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
				 	try {
				 		guiwindow.undoManager.undo();
			        } catch (Exception err) {
			        	System.err.println("Nothing to undo!");
			        }
				}
		 });
		 REDO.addActionListener(new ActionListener() {
			@Override
				public void actionPerformed(ActionEvent e) {
					try {
						guiwindow.undoManager.redo();
			        } catch (CannotRedoException err) {
			          	System.err.println("Nothing to redo!");
			        }
				} 
		 });
		 FINDREPLACE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					FindReplaceWindow frw = new FindReplaceWindow("Find/Replace",guiwindow.noteArea);
					frw.setVisible(true);
				}
		 });
		 HIGHLIGHT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					guiwindow.noteArea.getHighlighter().addHighlight(guiwindow.noteArea.getSelectionStart(), guiwindow.noteArea.getSelectionEnd(), guiwindow.yellowHighlight);
				} catch(Exception err) {
					System.err.println("There was a problem highlighting the text.");
				}
			} 
		 });
		 TABLE.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				InsertTableWindow itw = new InsertTableWindow(guiwindow.noteArea);
				itw.setVisible(true);
			}
		 });
		 WORDCOUNT.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				WordcountWindow wcw = new WordcountWindow(guiwindow);
				wcw.setVisible(true);
			}
		 });
		 MINIMIZE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					guiwindow.setState(JFrame.ICONIFIED);
				}
		 });
		 MAXIMIZE.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					guiwindow.setState(JFrame.NORMAL);
				}
		 });
		 ABOUT.addActionListener(new ActionListener() {
			 @Override
				public void actionPerformed(ActionEvent e) {
					AboutWindow aw = new AboutWindow("About");
					aw.setVisible(true);
				}
		 });
		 KEYHELP.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				KeyHelpWindow khw = new KeyHelpWindow("Key Help");
				khw.setVisible(true);
			}
		 });
	}

}
