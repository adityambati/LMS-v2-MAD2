const ReviewBook = {
    template: `
    <div>
    <div id="tables"><h2>Rate the book before you return it</h2></div>
    <div id="canvas2">
          <div class="mb-3">
            Rate the book out of 5
          </div>
          <div class="btn-group me-2" role="group" aria-label="First group">
            <button type="button" class="btn btn-danger" @click="returnBook(1)">1</button>
            <button type="button" class="btn btn-info" @click="returnBook(2)">2</button>
            <button type="button" class="btn btn-primary" @click="returnBook(3)">3</button>
            <button type="button" class="btn btn-warning" @click="returnBook(4)">4</button>
            <button type="button" class="btn btn-success" @click="returnBook(5)">5</button>
          </div>
          <div id="tables">
          <router-link to="/dashuser2">
            <button type="button" class="btn btn-danger btn-lg">Cancel</button>
          </router-link>
            </div>
      </div>
      </div>
    `,
    props: {
      book_id: {
        type: [Number, String],
        required: true,
      },
      user_id: {
        type: [Number, String],
        required: true,
      }
    },
    computed: {
        parsedBookId() {
            return Number(this.book_id);
        },
        parsedUserId() {
            return Number(this.user_id);
        }
    },
    methods: {
        async returnBook(rating) {
          try {
            const response = await fetch(`/api/return_book/${this.book_id}/${this.user_id}/${rating}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({rating}),
            });
            const data = await response.json();
            if (response.ok) {
              alert('Book returned successfully');
              this.$router.push('/dashuser2');
            } else {
              alert(`Error: ${data.error}`);
            }
          } catch (error) {
            console.error('Error returning book:', error);
          }
        },
      },
  };
  
  export default ReviewBook;
  