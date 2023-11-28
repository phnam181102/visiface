class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1.1) Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'summary'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1.2) Advanced filtering (/api/v1/tours?difficulty=easy&duration[gte]=5)
        // req.query: {difficulty: 'easy', duration: { gte: 5 }}
        // GOAL: {difficulty: 'easy', duration: { $gte: 5 }}
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        // If the user specifies a sort preference, use it
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            // Example: query.sort('-price ratingsAverage')
            this.query = this.query.sort(sortBy);
        }
        // Default to sorting by createdAt in descending order
        else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            // Example: query.select('name duration price')
            this.query = this.query.select(fields);
        } else {
            // Default does not include "__v"
            this.query = this.query.sort('-__v');
        }

        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 50;

        // page=3&limit=10 == skip 1-20 and get 21-30
        // GOAL: query.skip(20).limit(10)
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    // summary() {

    // }
}

module.exports = APIFeatures;
