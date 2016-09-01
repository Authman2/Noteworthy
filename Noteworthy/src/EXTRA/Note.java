package EXTRA;

// This is just an easier way to organize a note. Mostly just used for organization when saving.
public class Note {

	public String notebookToAddTo;
	public String noteName;
	public String noteContent;
	
	
	public Note(String notebook, String name, String content) {
		notebookToAddTo = notebook;
		noteName = name;
		noteContent = content;
	}
}
