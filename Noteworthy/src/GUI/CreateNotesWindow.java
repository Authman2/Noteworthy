package GUI;

import java.awt.BorderLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.JTree;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;
import javax.swing.tree.TreePath;

import EXTRA.Note;
import visualje.TextStyle;

public class CreateNotesWindow extends JFrame {
	private static final long serialVersionUID = 1L;

	// The jtree from the notebook list.
	JTree tree;
	
	
	public CreateNotesWindow(NotebooksWindow nbw) {
		super("Create Note");
		setSize(500, 100);
		setLocationRelativeTo(null);
		JFrame frame = this;
		tree = nbw.getNotebookTree();
		
		JTextField notebookToPlaceInto = new JTextField();
			notebookToPlaceInto.setText("Enter the name of the notebook you want to add this note to");
			
		JTextField noteNameField = new JTextField();
			noteNameField.setText("Enter the title of the note");
		
		
		JButton cancel = new JButton("Cancel");
		cancel.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				frame.dispose();
			}
		});
		
		
		JButton createNote = new JButton("Create Note");
		createNote.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
				if(!noteNameField.getText().equals("") && noteNameField.getText() != null) {
					if(!notebookToPlaceInto.getText().equals("") && notebookToPlaceInto.getText() != null) {
						addNote(noteNameField.getText(), notebookToPlaceInto.getText(), nbw);
					}
				} else {
					JOptionPane.showMessageDialog(frame, "You must enter a name for the note", "Missing Name", JOptionPane.ERROR_MESSAGE);
				}
			}
		});
		
		JPanel north = new JPanel(new GridLayout(1,2,1,1));
		north.add(notebookToPlaceInto);
		north.add(noteNameField);
		
		JPanel south = new JPanel(new GridLayout(1,2,1,1));
		south.add(cancel);
		south.add(createNote);
		
		add(north, BorderLayout.NORTH);
		add(south, BorderLayout.SOUTH);
		
		
		setVisible(true);
	}

	/** Adds a new notebook to the list of notebooks. */
	public void addNote(String noteName, String notebookName, NotebooksWindow nbw) {
		try {
			DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
			DefaultMutableTreeNode notebook = (DefaultMutableTreeNode) tree.getModel().getChild(tree.getModel().getRoot(), findNotebookIndex(notebookName));
		    DefaultMutableTreeNode child = new DefaultMutableTreeNode(noteName);
		    model.insertNodeInto(child, notebook, notebook.getChildCount());
		    tree.scrollPathToVisible(new TreePath(child.getPath()));
		    
		    // Change the temporary note in the GUIWindow.
		    nbw.getGUIWindow().tempNote = new Note(notebook.toString(), noteName, "Note");
		    
		    nbw.getGUIWindow().titleField.setText(noteName);
		    nbw.getGUIWindow().noteArea.setText("Note");
		    
			TextStyle t = new TextStyle(nbw.getGUIWindow().noteArea, 0, nbw.getGUIWindow().noteArea.getText().length(), "PLAIN");
			t.setFont(new Font("Comic Sans MS", 0, 16));
			t.addStyle();
		} catch(ArrayIndexOutOfBoundsException err) {
			JOptionPane.showMessageDialog(getParent(), "The notebook you are trying to add to does not exist.");
		}
	}
	
	/** Returns the index of a particular folder in the tree. */
	private int findNotebookIndex(String s) {
		for(int i = 0; i < tree.getModel().getChildCount(tree.getModel().getRoot()); i++) {
			if(tree.getModel().getChild(tree.getModel().getRoot(), i).toString().equals(s)) {
				return i;
			}
		}
		return -1;
	}
	
}
