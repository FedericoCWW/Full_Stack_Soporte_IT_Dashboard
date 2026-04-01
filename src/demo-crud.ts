import { db } from './db/index.js';
import { usersTable } from './db/schema/schema.js';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Starting CRUD operations...');

  try {
    // 1. CREATE
    console.log('\n--> 1. Creating a new user');
    const newUser = await db.insert(usersTable).values({
      name: 'Alice ' + Date.now(),
      email: `alice_${Date.now()}@example.com`,
    }).returning();
    console.log('Inserted:', newUser[0]);

    const userId = newUser[0].id;

    // 2. READ
    console.log('\n--> 2. Reading users');
    const allUsers = await db.select().from(usersTable);
    console.log('All Users:', allUsers);

    // 3. UPDATE
    console.log(`\n--> 3. Updating user with ID: ${userId}`);
    const updatedUser = await db.update(usersTable)
      .set({ name: 'Alice Updated', isActive: false })
      .where(eq(usersTable.id, userId))
      .returning();
    console.log('Updated:', updatedUser[0]);

    // 4. DELETE
    console.log(`\n--> 4. Deleting user with ID: ${userId}`);
    const deletedUser = await db.delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning();
    console.log('Deleted:', deletedUser[0]);

    console.log('\nCRUD operations completed successfully.');
  } catch (error) {
    console.error('Error executing CRUD:', error);
  }
}

main();