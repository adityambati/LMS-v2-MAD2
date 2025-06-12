const ReadBook = {
    template: `
    <div>
    <div id="tables"><h2>{{book_name}}</h2></div>
    <div id="canvas2">
        <div>
          <p>{{content}}</p>
        </div>
    </div>
    </div>
    `,
    data(){
        return{
            book_name: '',
            content: ''
        };
    },
    props: {
      book_id: {
        type: [String, Number],
        required: true,
      }
    },
    computed: {
        parsedBookId() {
          return Number(this.book_id);
        }
      },
    methods: {
        fetchBookContent() {
            fetch(`/api/read_book/${this.parsedBookId}`)
            .then(response => response.json())
            .then(data => {
                this.book_name=data.book_name;
                this.content=data.content;
            })
            .catch(error => {
                console.error('error fetching book content:', error);
            });
        }
      },
      mounted(){
        this.fetchBookContent();
      }
  };
  
  export default ReadBook;
  