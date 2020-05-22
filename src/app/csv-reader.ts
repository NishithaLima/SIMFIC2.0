export class CsvReader {
    public id: any;
    public bookId:any;
    public name: any;
    public genre:any;
    public authorname:any;


    
}
export class simBooks{
    private  id:String;
	private  name:String;
	private  genre:String;
	private  rank:number;
	private  score:String;
	private  author:String;
	private  epubPath:String;
	private  htmlPath:String;
	private  summary:String;
}

export class bookList{
	public globalFeature:String;
	public bookUI:Array<simBooks>;
}

export class UserEvent{
	public ParentBookID: String;
	public ParentGenre: String;
	public ChildBookID:String;
}

export class Config {
    url: {
        apiUrl: string;
    };
}



