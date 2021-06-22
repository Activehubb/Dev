const { check, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
// Importing all modules
const User = require('../../modules/User');
const Profile = require('../../modules/Profile');
const Post = require('../../modules/Post');

// @route       POST api/post
// @desc        Create Post
// @access      Private
router.post(
	'/',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});

			const post = await newPost.save();

			res.json(post);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @routes       GET api/posts
// @desc         Get All Posts
// @access       Public

router.get('/', [auth], async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });

		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @routes       GET api/posts/:id
// @desc         Get Posts by ID
// @access       Public

router.get('/:id', [auth], async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not Found' });
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not Found' });
		}

		res.status(500).send('Server Error');
	}
});

// @routes       DELETE api/posts/:id
// @desc         DEL Posts by ID
// @access       Public

router.delete('/:id', [auth], async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not Found' });
		}

		if (post.user.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Unauthorized access. Access Denied' });
		}

		await post.remove();

		res.json('Post Removed');
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @routes       PUT api/posts/like/:id
// @desc         Like a Post by ID
// @access       Private

router.put('/likes/:id', [auth], async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (
			post.likes.filter((like) => like.user.toString() === req.user.id).length >
			0
		) {
			return res.status(400).json({ msg: 'Post already liked' });
		}

		post.likes.unshift({ user: req.user.id });

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @routes       PUT api/posts/like/:id
// @desc         Unlike a Post by ID
// @access       Private

router.put('/unlikes/:id', [auth], async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length === 0
		) {
			return res.status(400).json({ msg: 'Post is unlike yet' });
		}

		// Get removed index
		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);

		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not Found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route       POST api/post/comment/:id
// @desc        Comments on a posts
// @access      Private
router.post(
	'/comment/:id',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const post = await Post.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);

			await post.save();

			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route 		DELETE api/post/comment/:id/:comment_id
// @desc 		Del comment by id
// access 		private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Pull out comment from the post

		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		// make sure comment exist
		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exist' });
		}

		// Check user permission
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Unauthorized Access' });
		}

		// Get RemovedIndex
		const removeIndex = post.comments
			.map((comment) => comment.user.toString())
			.indexOf(req.user.id);
		
		post.comments.splice(removeIndex, 1)

		await post.save()

		res.json(post.comments)
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});
module.exports = router;
