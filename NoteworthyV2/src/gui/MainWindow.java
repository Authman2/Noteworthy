package gui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.FlowLayout;

import javax.swing.JPanel;
import javax.swing.JTextArea;

import cw.components.titlebar.generic.TitlebarOrientation;
import cw.components.windows.specific.FlatWindow;
import je.visual.coolbuttons.CoolButton;
import je.visual.coolbuttons.PillButton;
import je.visual.coolbuttons.RectangleButton;

public class MainWindow extends FlatWindow { private static final long serialVersionUID = 1L;


	// Where you actually type the notes.
	JTextArea noteArea;
	
	// The buttons for the program.
	CoolButton newNoteButton, openNoteButton, saveNoteButton;
	CoolButton boldButton, italicButton, underlineButton;
	
	
	


	public MainWindow(String title, TitlebarOrientation orientation) {
		super(title, orientation);
		
		// Setup/Initialization
		noteArea = new JTextArea();
		
		newNoteButton = new PillButton("New", new Color(15,90,200));
			newNoteButton.setBounds(0, 5, 75, 30);
		openNoteButton = new PillButton("Open", new Color(15,90,200));
			openNoteButton.setBounds(0, 5, 80,30);
		saveNoteButton = new PillButton("Save", new Color(15,90,200));
			saveNoteButton.setBounds(0, 5, 80,30);
		boldButton = new RectangleButton("B", new Color(15,90,200));
			boldButton.setBounds(0, 5, 55,30);
		italicButton = new RectangleButton("i", new Color(15,90,200));
			italicButton.setBounds(0, 5, 55,30);
		underlineButton = new RectangleButton("_", new Color(15,90,200));
			underlineButton.setBounds(0, 5, 55,30);
			
		
		JPanel buttonsPanel = new JPanel(new FlowLayout());
		buttonsPanel.add(newNoteButton);
		buttonsPanel.add(openNoteButton);
		buttonsPanel.add(saveNoteButton);
		buttonsPanel.add(boldButton);
		buttonsPanel.add(italicButton);
		buttonsPanel.add(underlineButton);
		
		getWindowBody().add(buttonsPanel, BorderLayout.NORTH);
		getWindowBody().add(noteArea, BorderLayout.CENTER);
	}

}
