/// <reference path="../node/node.d.ts" />

declare module 'bufferstream' {

	class BufferStream implements ReadWriteStream {
		constructor (options?: BufferStream.Opts);
		/*
		 different buffer behaviors can be triggered by size:

		 none when output drains, bufferstream drains too
		 flexible buffers everthing that it gets and not piping out
		 <number> TODO buffer has given size. buffers everthing until buffer is full. when buffer is full then the stream will drain
		*/
		setSize(size: string): void; // can be one of ['none', 'flexible', <number>]
		setSize(size: number): void; // can be one of ['none', 'flexible', <number>]
		/*
		 enables stream buffering default
		*/
		enable(): void;
		/*
		 flushes buffer and disables stream buffering. BufferStream now pipes all data as long as the output accepting data. when the output is draining BufferStream will buffer all input temporary.

		 token[s] buffer splitters (should be String or Buffer)

		 disables given tokens. wont flush until no splitter tokens are left.
		*/
		disable(): void;
		disable(token: string, ...tokens: string[]): void;
		disable(tokens: string[]): void; // Array
		disable(token: NodeBuffer, ...tokens: NodeBuffer[]): void;
		disable(tokens: NodeBuffer[]): void; // Array
		/*
		 each time BufferStream finds a splitter token in the input data it will emit a split event. this also works for binary data.

		 token[s] buffer splitters (should be String or Buffer)
		*/
		split(token: string, ...tokens: string[]): void;
		split(tokens: string[]): void; // Array
		split(token: NodeBuffer, ...tokens: NodeBuffer[]): void;
		split(tokens: NodeBuffer[]): void; // Array
		/*
		 returns Buffer.
		*/
		getBuffer(): NodeBuffer;
		/*
		 returns Buffer.
		*/
		buffer: NodeBuffer;
		/*
		 shortcut for buffer.toString()
		*/
		toString(): string;
		/*
		 shortcut for buffer.length
		*/
		length: number;
	}

	module BufferStream {
		export interface Opts {
			/*
			 default encoding for writing strings
			*/
			encoding?: string;
			/*
			 if true and the source is a child_process the stream will block the entire process (timeouts wont work anymore, but splitting and listening on data still works, because they work sync)
			*/
			blocking?: boolean;
			/*
			 defines buffer level or sets buffer to given size (see ↓setSize for more)
			*/
			size?: number;
			/*
			 immediately call disable
			*/
			disabled?: boolean;
			/*
			 short form for:
				split(token, function (chunk) {emit('data', chunk)})
			*/
			// String or NodeBuffer
			split?: any;
		}
		export var fn: {warn: boolean};
	}

	export = BufferStream;
}

declare module 'bufferstream/postbuffer' {
	import http = require('http');
	import BufferStream = require('bufferstream');

	interface PostBuffer extends ReadWriteStream {
		/*
		 for if you want to get all the post data from a http server request and do some db reqeust before.

		 http client buffer
		*/
		constructor(req: http.ServerRequest);
		/*
			set a callback to get all post data from a http server request
		*/
		onEnd(callback: (data: any) => void);
		/*
		 pumps data into another stream to allow incoming streams given options will be passed to Stream.pipe
		*/
		pipe(stream: WritableStream, options?: BufferStream.Opts);
	}

	export = PostBuffer;
}
