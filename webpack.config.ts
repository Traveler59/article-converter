import * as MiniCssWebpackPlugin from 'mini-css-extract-plugin';

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: __dirname + '/dist',
		filename: 'main.js',
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
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
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json']
	},
	plugins: [
		new MiniCssWebpackPlugin({ filename: 'bundle.css' })
	]
};