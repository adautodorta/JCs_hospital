from supabase import create_client, Client

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

#Insert
# new_row = {'data'}
# supabase.table('TABELA').insert(new_row).execute()

#Update
# row_new = {'kaka'}
# supabase.table('Tabela').update(row_new).eq('id', 2).execute()

#Delete
# supabase.table('Tabela').delete().eq('id', 2).execute()

#Select
# results = supabase.table('PROFILES').select('*').execute()
# print(results)

