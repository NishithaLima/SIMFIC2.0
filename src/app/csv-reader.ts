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
		aUrl: string,
		bUrl: string,
		cUrl: string	
    };
}

export class GraphData{
	public name: any;
	public value: any;
}

export class GraphList{
	public name: any;
	public series: Array<GraphData>;
}

export class GlobalFeatureArray{
	public name:any;
	public tooltip:String;
}

export class WordCloudData{
	public text: String;
	public weight: number;
	public color:string;
}



