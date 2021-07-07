import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('cypress-ct e2e', () => {
  it('should create cypress-ct', async () => {
    const plugin = uniq('cypress-ct');
    ensureNxProject('@nx-plugins/cypress-ct', 'dist/libs/cypress-ct');
    await runNxCommandAsync(
      `generate @nx-plugins/cypress-ct:cypress-ct ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('cypress-ct');
      ensureNxProject('@nx-plugins/cypress-ct', 'dist/libs/cypress-ct');
      await runNxCommandAsync(
        `generate @nx-plugins/cypress-ct:cypress-ct ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('cypress-ct');
      ensureNxProject('@nx-plugins/cypress-ct', 'dist/libs/cypress-ct');
      await runNxCommandAsync(
        `generate @nx-plugins/cypress-ct:cypress-ct ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
