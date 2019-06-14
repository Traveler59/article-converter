import * as MiniCssWebpackPlugin from 'mini-css-extract-plugin';

module.exports = {
	entry: './src/index.js',
	output: {
		path: __dirname + '/dist',
		filename: 'main.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			},
			{
				test: /\.css$/,
				use: [MiniCssWebpackPlugin.loader, 'css-loader']
			},
			{
				test: /\.scss$/,
				use: [MiniCssWebpackPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}]
			}
		],
	},
	plugins: [
		new MiniCssWebpackPlugin({ filename: 'bundle.css' })
	]
};