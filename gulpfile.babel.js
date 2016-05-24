import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import bump from 'gulp-bump';
import git from 'gulp-git';
import runSequence from 'run-sequence';
import del from 'del';

gulp.task('lint', () =>
  gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', () =>
  gulp.src(['test/**/*.unit.js'], { read: false })
    .pipe(mocha()));

gulp.task('bump-version', () => {
  gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('clean', () =>
  del(['dist']));

gulp.task('build', ['clean'], () =>
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dist')));

gulp.task('git-commit-build', () =>
  gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('gulp-git-commit-build')));

gulp.task('git-push-develop', (callback) =>
  git.push('origin', 'develop', callback));

gulp.task('release', callback => {
  runSequence(
    'build',
    'git-commit-build',
    'git-push-develop',
    callback);
});
