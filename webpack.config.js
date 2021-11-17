const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'development',
	devServer: {
		open: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			favicon: 'favicon.ico'
		})
	],
	resolve: {
		extensions: ['.tsx', 'ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
}