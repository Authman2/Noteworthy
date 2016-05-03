package GUI;

import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

/**Copyright (C) 2016  Adeola Uthman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/
public class KeyHelpWindow extends JFrame {
	private static final long serialVersionUID = -53455332731117460L;

	JLabel newNoteL = new JLabel("	New Note						⌘+N");
	JLabel openNoteL = new JLabel("	Open Note						⌘+O");
	JLabel saveNoteL = new JLabel("	Save Note						⌘+S");
	JLabel saveNoteAsL = new JLabel("	Save As						⇧+⌘+S");
	JLabel findReplaceL = new JLabel("	Find/Replace						⌘+F");
	JLabel undoL = new JLabel("	Undo						⌘+Z");
	JLabel redoL = new JLabel("	Redo						⇧+⌘+Z");
	JLabel highlightL = new JLabel("	Highlight						⇧+⌘+H");
	JLabel boldL = new JLabel("	Bold								⌘+B");
	JLabel italicL = new JLabel("	Italic								⌘+I");
	JLabel underlineL = new JLabel("	Underline								⌘+U");
	JLabel strikeL = new JLabel("	Strikethrough								⌘+D");
	JLabel keyHelpL = new JLabel("	Key Help						⌘+K");
	
	
	public KeyHelpWindow(String title) {
		super(title);
		setSize(400,500);
		setLocationRelativeTo(null);
		
		
		JPanel panel = new JPanel(new GridLayout(13,1,5,5));
			panel.add(newNoteL);
			panel.add(openNoteL);
			panel.add(saveNoteL);
			panel.add(saveNoteAsL);
			panel.add(findReplaceL);
			panel.add(undoL);
			panel.add(redoL);
			panel.add(boldL);
			panel.add(italicL);
			panel.add(underlineL);
			panel.add(strikeL);
			panel.add(highlightL);
			panel.add(keyHelpL);
		getContentPane().add(panel);
	}

}
