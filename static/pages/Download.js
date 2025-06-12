const DownloadBook = {
    template: `
    <div>
    <div id="tables"><h2>Download from below</h2></div>
    <div id="canvas2">
          <div class="mb-3">
            <label for="" class="form-label">An amount of Rs.50 has been cut from your wallet.</label>
          </div>
          <div>
            Download your book from the Google drive link given below
          </div>
          <div>
            <a href="{{d_link}}">{{d_link}}</a>
          </div>
      </div>
    </div>
    `,
    data(){
        return{
            book_name: '',
            d_link: ''
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
        fetchBookLink() {
            fetch(`/api/read_book/${this.parsedBookId}`)
            .then(response => response.json())
            .then(data => {
                this.book_name=data.book_name;
                this.d_link=data.d_link;
            })
            .catch(error => {
                console.error('error fetching book link:', error);
            });
        }
      },
      mounted(){
        this.fetchBookLink();
      }
  };
  
  export default DownloadBook;
  