import * as gulp from 'gulp';
import * as path from 'path';
import { spawn } from 'child_process';
import { exec, formatCheckCircularText, formatCommandOutput, formatLintOutput, formatMochaTestOutput, formatTscCheckOutput } from './common/exec';
import { cleanDirAsync } from './common/util';

const workingDir = path.join(__dirname, '../../');

gulp.task('watch-compile', async () => {
	const tsconfigPath = path.join(workingDir, 'tsconfig.json');
	const child = spawn('tsc', ['-w', '-p', tsconfigPath], { shell: true });
	return new Promise<void>((resolve) => {
		child.on('close', resolve);
	});
});

gulp.task('clean', async () => {
	await cleanDirAsync(path.join(workingDir, 'out'));
	await cleanDirAsync(path.join(workingDir, 'node_modules'));
	await cleanDirAsync(path.join(workingDir, 'build', 'node_modules'));
	await cleanDirAsync(path.join(workingDir, 'build', 'out'));
});

gulp.task('compile', async () => {
	await exec('tsc', { workingDir, logPrefix: '[tsc] ', formatText: formatCommandOutput });
});

gulp.task('watch-run', async () => {
	await new Promise<void>((resolve) => {
		gulp.series('compile', 'run', 'check', 'test')(() => resolve());
	});

	gulp.watch(path.join(workingDir, 'out/**/*.js'), gulp.series('run', 'check', 'test'));
});

gulp.task('watch', gulp.parallel('watch-compile', 'watch-run'));

gulp.task('run', async () => {
	await exec('node ./out/main.js', { workingDir, logPrefix: '[run] ', formatText: formatCommandOutput, verbose: true });
});

gulp.task('check', async () => {
	await exec('tsc --noEmit', { workingDir, logPrefix: '[tsc-check] ', formatText: formatTscCheckOutput });
	await exec('madge -c --extensions ts,tsx ./src ./build/src', { workingDir, logPrefix: '[madge] ', formatText: formatCheckCircularText });
	await exec('eslint ./src ./build/src --fix', { workingDir, logPrefix: '[eslint:fix] ', formatText: formatLintOutput, noThrow: true });
});

gulp.task('test', async () => {
	await exec('mocha', { logPrefix: '[test] ', workingDir, formatText: formatMochaTestOutput });
});
