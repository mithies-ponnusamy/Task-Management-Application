import type { User } from './user.model';

describe('User', () => {
  it('should create an instance', () => {
    // Mock object to satisfy the type
    const user: User = {} as User;
    expect(user).toBeTruthy();
  });
});
