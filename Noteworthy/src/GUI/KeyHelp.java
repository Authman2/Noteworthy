package GUI;

import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class KeyHelp extends JFrame {
	private static final long serialVersionUID = -53455332731117460L;

	JLabel newNoteL = new JLabel("	New Note						⌘+N");
	JLabel openNoteL = new JLabel("	Open Note						⌘+O");
	JLabel saveNoteL = new JLabel("	Save Note						⌘+S");
	JLabel saveNoteAsL = new JLabel("	Save As						⇧+⌘+S");
	JLabel findReplaceL = new JLabel("	Find/Replace						⌘+F");
	JLabel undoL = new JLabel("	Undo						⌘+Z");
	JLabel redoL = new JLabel("	Redo						⇧+⌘+Z");
	JLabel highlightL = new JLabel("	Highlight						⇧+⌘+H");
	JLabel keyHelpL = new JLabel("	Key Help						⌘+K");
	
	
	public KeyHelp(String title) {
		super(title);
		setSize(400,500);
		setLocationRelativeTo(null);
		
		
		JPanel panel = new JPanel(new GridLayout(9,1,5,5));
			panel.add(newNoteL);
			panel.add(openNoteL);
			panel.add(saveNoteL);
			panel.add(saveNoteAsL);
			panel.add(findReplaceL);
			panel.add(undoL);
			panel.add(redoL);
			panel.add(highlightL);
			panel.add(keyHelpL);
		getContentPane().add(panel);
	}

}
