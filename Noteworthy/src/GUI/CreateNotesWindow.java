package GUI;

import java.awt.BorderLayout;
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
			notebookToPlaceInto.setText("Enter the name of the notebook you want to place this note into");
		JTextField noteNameField = new JTextField();
			noteNameField.setText("Enter the title of the note");
		
		
		JButton cancel = new JButton("Cancel");
		cancel.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				frame.dispose();
			}
		});
		
		
		JButton createNote = new JButton("Create Noteb");
		createNote.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
				if(!noteNameField.getText().equals("") && noteNameField.getText() != null) {
					addNotebook(noteNameField.getText(), notebookToPlaceInto.getText(), frame);
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
	public void addNotebook(String noteName, String notebookName, JFrame f) {
		DefaultTreeModel model = (DefaultTreeModel) tree.getModel();
		DefaultMutableTreeNode notebook = (DefaultMutableTreeNode) tree.getModel().getChild(tree.getModel().getRoot(), findNotebookIndex(notebookName));
	    DefaultMutableTreeNode child = new DefaultMutableTreeNode(noteName);
	    model.insertNodeInto(child, notebook, notebook.getChildCount());
	    tree.scrollPathToVisible(new TreePath(child.getPath()));
	    f.dispose();
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
